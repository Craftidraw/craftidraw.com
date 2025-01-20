'use client';

import { useCallback, useRef } from 'react';
import type { RootState } from '~/lib/store/store';
import type {
    CircleItem,
    CustomItem,
    ImageItem,
    Item,
    LineItem,
    Position,
    RectangleItem,
    TextItem,
} from '~/types/item';
import type Konva from 'konva';
import { throttle } from 'lodash';
import type { HistoryAction } from '~/types/history';
import { useAppDispatch, useAppSelector } from '~/lib/store/hooks';
import {
    addToHistory,
    selectAllItems,
    setIsSaved,
    setItem,
    setItems,
    setSelectedItem,
} from '~/lib/store/features/appSlice';
import { useStorage } from '~/providers/StorageProvider';
import { useMath } from './useMath';
import { useStage } from '~/providers/StageProvider';

export const useItem = () => {
    const dispatch = useAppDispatch();
    const { requestItemSave } = useStorage();
    const { getRectConnectorPoints, getEllipseConnectorPoints, getDiamondConnectorPoints, hasIntersection } = useMath();
    const { itemLayerRef } = useStage();

    const board = useAppSelector((state: RootState) => state.app.board);
    const items = useAppSelector(selectAllItems);

    const preparedActionRef = useRef<Partial<HistoryAction> | null>(null);
    const localItemRef = useRef<Item | null>(null);
        
    const handleItemSave = useCallback(
        (itemToSave: Item[] | null = null) => {
            dispatch(setIsSaved('pending'));

            const itemsToSave = itemToSave ?? items;

            requestItemSave(itemsToSave, (success: boolean) => {
                if (success) {
                    dispatch(setIsSaved('saved'));
                } else {
                    console.error('Failed to save items');
                    dispatch(setIsSaved('failure'));
                }
            });
        },
        [items, dispatch, requestItemSave],
    );

    const updateItems = useCallback(
        (itemsToUpdate: Item[], previousItems?: Item[]) => {
            const updatedItems = itemsToUpdate.map((item) => ({
                ...item,
                version: item.version + 1,
            }));

            const newItems = items.map((item) => {
                const updatedItem = updatedItems.find((u) => u.id === item.id);
                return updatedItem ?? item;
            });

            dispatch(setItems(newItems));

            if (previousItems) {
                dispatch(
                    addToHistory({
                        type: 'update',
                        previousSnapshots: previousItems,
                        currentSnapshots: updatedItems,
                    } as HistoryAction),
                );
            }
            handleItemSave(newItems);
        },
        [dispatch, handleItemSave, items],
    );

    const updateItem = useCallback(
        (current: Item, previous?: Item) => {
            updateItems([current], previous ? [previous] : undefined);
        },
        [updateItems],
    );

    const selectItem = (e: Konva.KonvaEventObject<MouseEvent>, item: Item) => {
        e.cancelBubble = true;
        dispatch(setSelectedItem(item.id));
    };

    const getSnappedPosition = useCallback(
        (x: number, y: number): Position => {
            if (!board.snapToGrid) return { x, y };

            return {
                x: Math.round(x / board.snapIncrement) * board.snapIncrement,
                y: Math.round(y / board.snapIncrement) * board.snapIncrement,
            };
        },
        [board.snapIncrement, board.snapToGrid],
    );

    const calculateNewPoints = (item: Item, position: Position, originPoint: Position): number[] => {
        switch (item.type) {
            case 'circle':
                return getEllipseConnectorPoints(
                    {
                        x: position.x,
                        y: position.y,
                        width: (item as CircleItem).size.width,
                        height: (item as CircleItem).size.height,
                    },
                    originPoint,
                );
            case 'diamond':
                return getDiamondConnectorPoints(
                    {
                        x: position.x,
                        y: position.y,
                        width: (item as RectangleItem).size.width,
                        height: (item as RectangleItem).size.height,
                    },
                    originPoint,
                );
            default:
                return getRectConnectorPoints(
                    {
                        x: position.x,
                        y: position.y,
                        width: (item as RectangleItem).size.width,
                        height: (item as RectangleItem).size.height,
                    },
                    originPoint,
                ).filter((point): point is number => point !== undefined);
        }
    };

    const updateConnectedLines = (item: Item, newPosition: Position, attachments: Array<{ connector: string }>) => {
        attachments.forEach((attachment) => {
            const connectedLine = items.find((i) => i.id === attachment.connector) as LineItem;
            if (!connectedLine) return;

            const connectionIndex =
                item.id === connectedLine.headConnector?.connected
                    ? 1
                    : item.id === connectedLine.tailConnector?.connected
                      ? 0
                      : -1;

            if (connectionIndex === -1) return;

            const originPoint = {
                x: connectionIndex === 0 ? connectedLine.points[2] : connectedLine.points[0],
                y: connectionIndex === 0 ? connectedLine.points[3] : connectedLine.points[1],
            } as Position;

            const newPoints = calculateNewPoints(item, newPosition, originPoint);
            const points = [...connectedLine.points];
            const relativeX = connectedLine.position?.x ?? 0;
            const relativeY = connectedLine.position?.y ?? 0;

            if (connectionIndex === 0 && newPoints[0] !== undefined && newPoints[1] !== undefined) {
                points[0] = newPoints[0] - relativeX;
                points[1] = newPoints[1] - relativeY;
            } else if (newPoints[0] !== undefined && newPoints[1] !== undefined) {
                points[2] = newPoints[0] - relativeX;
                points[3] = newPoints[1] - relativeY;
            }

            const foundLine = itemLayerRef.current?.findOne(`#${connectedLine.id}`);
            if (foundLine) {
                foundLine.setAttrs({ points });
                dispatch(setItem({ ...connectedLine, points } as LineItem));
            }
        });
    };

    const highlightAttachmentZones = useCallback(
        (item: Item, x: number, y: number) => {
            if (!itemLayerRef.current) return;

            itemLayerRef.current.getChildren().forEach((child) => {
                if (child.attrs.id === item?.id) return;
                if (child.hasChildren()) {
                    const group = child as Konva.Group;
                    group.getChildren().forEach((groupChild) => {
                        const childId = groupChild.attrs.id;
                        if (childId?.includes('attachment-zone')) {
                            if (hasIntersection(groupChild.attrs, { x, y, width: 4, height: 4 })) {
                                groupChild.setAttrs({ fill: 'rgb(156, 219, 166)' });
                            } else {
                                groupChild.setAttrs({ fill: 'transparent' });
                            }
                        }
                    });
                }
            });
        },
        [hasIntersection, itemLayerRef],
    );

    const moveItemStart = (item: Item) => {
        const itemsToSave: Item[] = [item];
        if (item.type !== 'line' && item.type !== 'arrow') {
            for (const attachment of item.attachments ?? []) {
                const connectedLine = items.find((i) => i.id === attachment.connector) as LineItem;
                if (connectedLine) {
                    itemsToSave.push(connectedLine);
                }
            }
        }
        preparedActionRef.current = {
            type: 'update',
            previousSnapshots: itemsToSave,
        };
        localItemRef.current = item;
    };

    const moveItem = throttle((e: Konva.KonvaEventObject<MouseEvent>, item: Item) => {
        const node = e.target;
        const { x, y } = node.position();

        const snappedPosition = getSnappedPosition(x, y);
        localItemRef.current = {
            ...item,
            position: snappedPosition,
        };

        if (item.type === 'line' || item.type === 'arrow') return;

        const attachments = item.attachments ?? [];
        if (attachments.length > 0) {
            updateConnectedLines({ ...localItemRef.current }, snappedPosition, attachments);
        }
    }, 1000 / 144);

    const moveItemEnd = useCallback(
        (item: Item) => {
            if (!preparedActionRef.current?.previousSnapshots) return;

            const snappedPosition = getSnappedPosition(
                localItemRef.current?.position.x ?? 0,
                localItemRef.current?.position.y ?? 0,
            );

            const updatedItems = [
                {
                    ...item,
                    position: snappedPosition,
                    version: item.version + 1,
                },
            ];
            
            if (item.type !== 'line' && item.type !== 'arrow') {
                for (const attachment of item.attachments ?? []) {
                    const foundLine = itemLayerRef.current?.findOne(`#${attachment.connector}`);
                    const connectedLine = items.find((i) => i.id === attachment.connector) as LineItem;
                    if (foundLine) {
                        const points = foundLine.attrs.points;
                        updatedItems.push({
                            ...connectedLine,
                            points: points,
                            version: connectedLine.version + 1,
                        } as LineItem);
                    }
                }
            }
            updateItems(updatedItems, preparedActionRef.current?.previousSnapshots);
            preparedActionRef.current = null;
        },
        [getSnappedPosition, updateItems, items, itemLayerRef],
    );

    const moveAnchorStart = (item: LineItem) => {
        preparedActionRef.current = {
            type: 'update',
            previousSnapshots: [{ ...item }],
        };
        localItemRef.current = item;
    };

    const moveAnchor = throttle((index, e: Konva.KonvaEventObject<MouseEvent>, item: LineItem) => {
        if (itemLayerRef.current === null) return;

        const node = e.target.position();
        const { x, y } = node;
        const snappedPosition = getSnappedPosition(x, y);

        const updatedPoints = [...item.points];
        updatedPoints[index * 2] = snappedPosition.x - (item.position.x ?? 0);
        updatedPoints[index * 2 + 1] = snappedPosition.y - (item.position.y ?? 0);

        localItemRef.current = {
            ...item,
            points: updatedPoints,
        } as LineItem;

        const lineId = item.id;
        const lineNode = itemLayerRef.current.findOne(`#${lineId}`);
        if (lineNode) {
            lineNode.setAttr('points', updatedPoints);
        }

        highlightAttachmentZones(item, snappedPosition.x, snappedPosition.y);
    }, 1000 / 144);

    const moveAnchorEnd = useCallback(
        (index: number, item: LineItem) => {
            if (!itemLayerRef.current) return;

            const lineRef = localItemRef.current as LineItem;

            const anchor = {
                x: lineRef.points[index * 2]!,
                y: lineRef.points[index * 2 + 1]!,
            } as Position;
            let isOnAttachmentZone = false;
            let currentConnectorId: string | undefined;

            itemLayerRef.current.getChildren().forEach((child) => {
                if (child.attrs.id === item?.id) return;
                if (child.hasChildren()) {
                    const group = child as Konva.Group;
                    group.getChildren().forEach((groupChild) => {
                        const childId = groupChild.attrs.id;
                        if (childId?.includes('attachment-zone')) {
                            groupChild.setAttrs({ fill: 'transparent' });
                            const id = childId.split('-attachment-zone')[0];
                            if (hasIntersection(groupChild.attrs, { ...anchor, width: 4, height: 4 })) {
                                isOnAttachmentZone = true;
                                currentConnectorId = id;
                            }
                        }
                    });
                }
            });

            const connectorKey = index === 0 ? 'tailConnector' : 'headConnector';
            const currentConnection = lineRef[connectorKey]?.connected;
            let updatedLine: LineItem;
            let connectedItem: Item | undefined;

            if (isOnAttachmentZone && !currentConnection) {
                // Find the item we're connecting to
                connectedItem = items.find((i) => i.id === currentConnectorId);
                if (!connectedItem) return;

                updatedLine = {
                    ...lineRef,
                    [connectorKey]: { connected: currentConnectorId },
                    version: lineRef.version + 1,
                } as LineItem;

                const updatedConnectedItem = {
                    ...connectedItem,
                    attachments: [...(connectedItem.attachments ?? []), { connector: lineRef.id }],
                    version: connectedItem.version + 1,
                };

                updateItems([updatedLine, updatedConnectedItem], [lineRef, connectedItem]);
            } else if (!isOnAttachmentZone && currentConnection) {
                // Find the item we're disconnecting from
                connectedItem = items.find((i) => i.id === currentConnection);
                if (!connectedItem) return;

                updatedLine = {
                    ...lineRef,
                    [connectorKey]: undefined,
                    version: lineRef.version + 1,
                } as LineItem;

                const updatedConnectedItem = {
                    ...connectedItem,
                    attachments: connectedItem.attachments?.filter((a) => a.connector !== lineRef.id),
                    version: connectedItem.version + 1,
                };

                updateItems([updatedLine, updatedConnectedItem], [lineRef, connectedItem]);
            } else {
                updatedLine = { ...lineRef };
                updateItems([updatedLine], [lineRef]);
            }

            preparedActionRef.current = null;
        },
        [updateItems, hasIntersection, itemLayerRef, items],
    );

    const transformItemStart = (item: Item) => {
        preparedActionRef.current = {
            type: 'update',
            previousSnapshots: [{ ...item }],
        };
        localItemRef.current = item;
    };

    const transformItem = throttle((e: Konva.KonvaEventObject<Event>, item: Item) => {
        if (item.type === 'line' || item.type === 'arrow' || item.type === 'draw') return;

        const node = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);

        const width = Math.max(5, node.width() * scaleX);
        const height = Math.max(5, node.height() * scaleY);

        if (item.type === 'diamond') {
            const newRhombusPoints = [width / 2, 0, width, height / 2, width / 2, height, 0, height / 2, width / 2, 0];
            node.setAttrs({ points: newRhombusPoints });
        } else if (item.type === 'circle') {
            node.setAttrs({
                radiusX: width / 2,
                radiusY: height / 2,
                offsetX: -width / 2,
                offsetY: -height / 2,
            });
        } else {
            node.setAttrs({ width, height });
        }

        localItemRef.current = {
            ...item,
            size: { width, height },
        } as RectangleItem | CircleItem | CustomItem | TextItem | ImageItem;
    }, 1000 / 144);

    const transformItemEnd = useCallback(
        (item: Item) => {
            if (!localItemRef.current) return;
            if (!preparedActionRef.current?.previousSnapshots) return;

            const validItem = localItemRef.current as RectangleItem | CircleItem | CustomItem | TextItem | ImageItem;

            const updatedItem = {
                ...validItem,
                size: {
                    width: validItem.size.width,
                    height: validItem.size.height,
                },
                version: item.version + 1,
            } as RectangleItem | CircleItem | CustomItem | TextItem | ImageItem;
            updateItem(updatedItem, preparedActionRef.current?.previousSnapshots[0]);

            preparedActionRef.current = null;
        },
        [updateItem],
    );

    return {
        handleItemSave,
        updateItem,
        updateItems,
        selectItem,
        moveItemStart,
        moveItem,
        moveItemEnd,
        moveAnchorStart,
        moveAnchor,
        moveAnchorEnd,
        transformItemStart,
        transformItem,
        transformItemEnd,
    };
};
