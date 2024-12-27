'use client';

import React, { useEffect, useState } from 'react';
import { Stage } from 'react-konva';
import { addItem, addToHistory, selectAllItems, setSelectedItem, setSelectedTool } from '~/lib/store/features/appSlice';
import type Konva from 'konva';
import GridLayer from './GridLayer';
import ItemLayer from './ItemLayer';
import type {
    Item,
    CircleItem,
    LineItem,
    RectangleItem,
    TextItem,
    DrawItem,
    ImageItem,
    CustomItem,
} from '~/types/item';
import type { RootState } from '~/lib/store/store';
import createCUID from '~/lib/cuid/createCUID';
import { useAppDispatch, useAppSelector } from '~/lib/store/hooks';
import { useZoom } from '~/hooks/useZoom';
import { useShortcut } from '~/hooks/useShortcut';
import { useStage } from '~/providers/StageProvider';
import { useItem } from '~/hooks/useItem';

const Canvas = () => {
    const dispatch = useAppDispatch();
    const { useKeyPress, useKeyRelease, cut, paste, redo, copy, remove, undo, quickMoveUp, quickMoveDown } =
        useShortcut();
    const { stageRef, transformerRef } = useStage();
    const { handleItemSave } = useItem();

    const items = useAppSelector(selectAllItems);
    const selectedTool = useAppSelector((state: RootState) => state.app.selectedTool);
    const selectedItem = useAppSelector((state: RootState) => state.app.selectedItem);
    const board = useAppSelector((state: RootState) => state.app.board);
    const isCustomExportsOpen = useAppSelector((state: RootState) => state.app.isCustomExportsOpen);

    const [isDrawing, setIsDrawing] = useState(false);
    const [previewItem, setPreviewItem] = useState<Item | null>(null);

    useEffect(() => {
        if (selectedItem && transformerRef.current && stageRef.current) {
            setTimeout(() => {
                const selectedNode = stageRef.current?.findOne('#' + selectedItem.id);
                if (selectedNode) {
                    transformerRef.current?.nodes([selectedNode]);
                } else {
                    transformerRef.current?.nodes([]);
                }
            }, 10);
        } else {
            transformerRef.current?.nodes([]);
        }
    }, [selectedItem, stageRef, transformerRef, selectedItem?.version]);

    useKeyPress(' ', () => {
        if (isCustomExportsOpen) return;
        if (!selectedItem && selectedTool !== 'move') {
            void quickMoveDown();
        }
    });

    useKeyRelease(' ', () => {
        if (isCustomExportsOpen) return;
        if (!selectedItem) {
            void quickMoveUp();
        }
    });

    useKeyPress('c', (event) => {
        if (isCustomExportsOpen) return;
        if (event.ctrlKey || event.metaKey) {
            void copy();
        }
    });

    useKeyPress('x', (event) => {
        if (isCustomExportsOpen) return;
        if (event.ctrlKey || event.metaKey) {
            void cut();
        }
    });

    useKeyPress('v', (event) => {
        if (isCustomExportsOpen) return;
        if (event.ctrlKey || event.metaKey) {
            void paste();
        }
    });

    useKeyPress('z', (event) => {
        if (isCustomExportsOpen) return;
        if (event.ctrlKey || event.metaKey) {
            void undo();
        }
    });

    useKeyPress('y', (event) => {
        if (isCustomExportsOpen) return;
        if (event.ctrlKey || event.metaKey) {
            void redo();
        }
    });

    useKeyPress('Backspace', () => {
        if (isCustomExportsOpen) return;
        void remove();
    });

    const handleDeselect = (e: Konva.KonvaEventObject<MouseEvent>) => {
        const clickedOnEmpty = e.target === e.target.getStage() || e.target.getParent()?.name() === 'gridLayer';
        if (clickedOnEmpty) {
            dispatch(setSelectedItem(null));
            if (transformerRef.current) {
                transformerRef.current.nodes([]);
            }
        }
    };

    const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (selectedTool && !isDrawing) {
            const stage = e.target.getStage()!;
            const pos = stage.getRelativePointerPosition()!;
            if (selectedTool === 'rectangle') {
                setIsDrawing(true);
                const newItem: RectangleItem = {
                    isFillable: true,
                    isStrokeable: true,
                    id: createCUID(),
                    position: { x: pos.x, y: pos.y },
                    size: { width: 0, height: 0 },
                    borderRadius: 0,
                    strokeColor: '#000000',
                    strokeOpacity: 1,
                    strokeWidth: 1,
                    strokeStyle: 'solid',
                    version: 1,
                    attachments: [],
                    fillColor: '#ffffff',
                    fillOpacity: 1,
                    isStrokeEnabled: true,
                    isFillEnabled: false,
                    type: 'rectangle',
                };
                setPreviewItem(newItem);
            } else if (selectedTool === 'diamond') {
                setIsDrawing(true);
                const newItem: RectangleItem = {
                    isFillable: true,
                    isStrokeable: true,
                    id: createCUID(),
                    position: { x: pos.x, y: pos.y },
                    size: { width: 0, height: 0 },
                    borderRadius: 0,
                    strokeColor: '#000000',
                    strokeOpacity: 1,
                    strokeWidth: 1,
                    strokeStyle: 'solid',
                    version: 1,
                    attachments: [],
                    fillColor: '#ffffff',
                    fillOpacity: 1,
                    isStrokeEnabled: true,
                    isFillEnabled: false,
                    type: 'diamond',
                };
                setPreviewItem(newItem);
            } else if (selectedTool === 'circle') {
                setIsDrawing(true);
                const newItem: CircleItem = {
                    isFillable: true,
                    isStrokeable: true,
                    id: createCUID(),
                    position: { x: pos.x, y: pos.y },
                    size: { width: 0, height: 0 },
                    strokeColor: '#000000',
                    strokeOpacity: 1,
                    strokeWidth: 1,
                    strokeStyle: 'solid',
                    version: 1,
                    attachments: [],
                    fillColor: '#ffffff',
                    fillOpacity: 1,
                    isStrokeEnabled: true,
                    isFillEnabled: false,
                    type: 'circle',
                };
                setPreviewItem(newItem);
            } else if (selectedTool === 'text') {
                setIsDrawing(true);
                const newItem: TextItem = {
                    isFillable: true,
                    isStrokeable: true,
                    id: createCUID(),
                    position: { x: pos.x, y: pos.y },
                    size: { width: 0, height: 0 },
                    text: 'New Text',
                    type: 'text',
                    version: 1,
                    attachments: [],
                    strokeColor: '#000000',
                    strokeOpacity: 1,
                    strokeWidth: 1,
                    strokeStyle: 'solid',
                    fillColor: '#000000',
                    fillOpacity: 1,
                    isStrokeEnabled: false,
                    isFillEnabled: true,
                    textAlign: 'center',
                    fontSize: 16,
                    fontFamily: 'Arial',
                    fontEffect: 'normal',
                    fontDecoration: 'none',
                };
                setPreviewItem(newItem);
            } else if (selectedTool === 'line') {
                setIsDrawing(true);
                const newItem: LineItem = {
                    isFillable: true,
                    isStrokeable: true,
                    points: [pos.x, pos.y, pos.x, pos.y],
                    isArrow: false,
                    hasArrowTail: false,
                    hasArrowHead: false,
                    id: createCUID(),
                    type: 'line',
                    position: { x: 0, y: 0 },
                    version: 1,
                    attachments: [],
                    strokeColor: '#000000',
                    strokeOpacity: 1,
                    strokeStyle: 'solid',
                    strokeWidth: 1,
                    isStrokeEnabled: true,
                    fillColor: '#000000',
                    fillOpacity: 1,
                    isFillEnabled: true,
                };
                setPreviewItem(newItem);
            } else if (selectedTool === 'arrow') {
                setIsDrawing(true);
                const newItem: LineItem = {
                    isFillable: true,
                    isStrokeable: true,
                    isArrow: true,
                    points: [pos.x, pos.y, pos.x, pos.y],
                    hasArrowTail: false,
                    hasArrowHead: true,
                    id: createCUID(),
                    type: 'arrow',
                    position: { x: 0, y: 0 },
                    version: 1,
                    attachments: [],
                    strokeColor: '#000000',
                    strokeOpacity: 1,
                    strokeStyle: 'solid',
                    strokeWidth: 1,
                    isStrokeEnabled: true,
                    fillColor: '#000000',
                    fillOpacity: 1,
                    isFillEnabled: true,
                };
                setPreviewItem(newItem);
            } else if (selectedTool === 'image') {
                setIsDrawing(true);
                const newItem: ImageItem = {
                    id: createCUID(),
                    position: { x: pos.x, y: pos.y },
                    size: { width: 0, height: 0 },
                    type: 'image',
                    version: 1,
                    attachments: [],
                    isStrokeable: false,
                    isFillable: false,
                };
                setPreviewItem(newItem);
            } else if (selectedTool === 'draw') {
                setIsDrawing(true);
                const newItem: DrawItem = {
                    points: [pos.x, pos.y, pos.x, pos.y],
                    id: createCUID(),
                    type: 'draw',
                    position: { x: 0, y: 0 },
                    size: { width: 0, height: 0 },
                    version: 1,
                    attachments: [],
                    strokeColor: '#000000',
                    strokeOpacity: 1,
                    strokeStyle: 'solid',
                    strokeWidth: 1,
                    isStrokeEnabled: true,
                    fillColor: '#000000',
                    fillOpacity: 1,
                    isFillEnabled: true,
                    isStrokeable: true,
                    isFillable: true,
                };
                setPreviewItem(newItem);
            } else if (selectedTool === 'custom') {
                setIsDrawing(true);
                const newItem: CustomItem = {
                    id: createCUID(),
                    position: { x: pos.x, y: pos.y },
                    size: { width: 0, height: 0 },
                    type: 'custom',
                    version: 1,
                    attachments: [],
                    entity: 'New-Entity',
                    displayName: {
                        text: 'New-Entity',
                        fontSize: 14,
                    },
                    lore: [],
                    showTooltip: false,
                    isStrokeable: false,
                    isFillable: false,
                };
                setPreviewItem(newItem);
            }
        }
    };

    const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (isDrawing && previewItem) {
            const pos = e.target.getStage()!.getRelativePointerPosition()!;
            const { x, y } = pos;

            switch (previewItem.type) {
                case 'rectangle':
                case 'diamond':
                case 'circle':
                case 'text':
                    setPreviewItem({
                        ...previewItem,
                        size: {
                            width: x - previewItem.position.x,
                            height: y - previewItem.position.y,
                        },
                    } as RectangleItem | CircleItem | TextItem);
                    break;
                case 'image':
                case 'custom':
                    setPreviewItem({
                        ...previewItem,
                        size: {
                            width: x - previewItem.position.x,
                            height: y - previewItem.position.y,
                        },
                    } as ImageItem);
                    break;
                case 'line':
                case 'arrow':
                    setPreviewItem({
                        ...previewItem,
                        points: [(previewItem as LineItem).points[0]!, (previewItem as LineItem).points[1]!, x, y],
                    } as LineItem);
                    break;
                case 'draw':
                    setPreviewItem({
                        ...previewItem,
                        points: [...(previewItem as DrawItem).points, x, y],
                    } as DrawItem);
                    break;
                default:
                    console.warn(`Unhandled tool: ${selectedTool}`);
            }
        }
    };

    const handleMouseUp = () => {
        if (isDrawing && previewItem) {
            setIsDrawing(false);
            dispatch(addItem(previewItem));
            dispatch(setSelectedItem(previewItem));
            dispatch(setSelectedTool('pointer'));
            dispatch(
                addToHistory({
                    type: 'create',
                    currentSnapshots: [{ ...previewItem }],
                }),
            );
            handleItemSave([...items, previewItem]);
            setPreviewItem(null);
        }
    };

    const handleWheel = useZoom(stageRef);

    return (
        <Stage
            style={{ paddingTop: '90px' }}
            ref={stageRef}
            x={stageRef.current?.x() ?? 0}
            y={stageRef.current?.y() ?? 0}
            width={window.innerWidth}
            height={window.innerHeight - 90}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onDragEnd={() => ({ x: stageRef.current!.x(), y: stageRef.current!.y() })}
            onClick={handleDeselect}
            draggable={!isDrawing && selectedTool === 'move'}
            onWheel={handleWheel}
        >
            {board.enableGrid && <GridLayer stagePos={stageRef.current?.position() ?? { x: 0, y: 0 }} />}
            <ItemLayer previewItem={previewItem} />
        </Stage>
    );
};

export default Canvas;
