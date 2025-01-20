'use client';

import React, { useEffect, useState } from 'react';
import { Stage } from 'react-konva';
import {
    addItem,
    addToHistory,
    selectAllItems,
    selectItemById,
    setSelectedItem,
    setSelectedTool,
} from '~/lib/store/features/appSlice';
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
import { useItemOperations } from '~/hooks/useItemOperations';
import {
    DEFAULT_ARROW,
    DEFAULT_CIRCLE,
    DEFAULT_CUSTOM,
    DEFAULT_DIAMOND,
    DEFAULT_DRAW,
    DEFAULT_IMAGE,
    DEFAULT_LINE,
    DEFAULT_RECTANGLE,
    DEFAULT_TEXT,
} from '~/utils/defaults';
import { useTheme } from '~/providers/ThemeProvider';

const Canvas = () => {
    const dispatch = useAppDispatch();
    const { useKeyPress, useKeyRelease, quickMoveUp, quickMoveDown } = useShortcut();
    const { copy, cut, paste, remove, undo, redo } = useItemOperations();
    const { stageRef, transformerRef, tooltipTransformerRef } = useStage();
    const { handleItemSave } = useItem();
    const { isDark } = useTheme();

    const items = useAppSelector(selectAllItems);
    const selectedTool = useAppSelector((state: RootState) => state.app.selectedTool);
    const selectedItem = useAppSelector((state: RootState) => state.app.selectedItem);
    const currentItem = useAppSelector((state: RootState) => selectItemById(state, selectedItem ?? ''));
    const board = useAppSelector((state: RootState) => state.app.board);
    const isCustomExportsOpen = useAppSelector((state: RootState) => state.app.isCustomExportsOpen);

    const [isDrawing, setIsDrawing] = useState(false);
    const [previewItem, setPreviewItem] = useState<Item | null>(null);

    useEffect(() => {
        if (currentItem && transformerRef.current && stageRef.current) {
            setTimeout(() => {
                const selectedNode = stageRef.current?.findOne('#' + currentItem.id);
                if (selectedNode) {
                    transformerRef.current?.nodes([selectedNode]);
                } else {
                    transformerRef.current?.nodes([]);
                }
            }, 10);
        } else {
            transformerRef.current?.nodes([]);
        }

        if (
            currentItem &&
            tooltipTransformerRef.current &&
            stageRef.current &&
            currentItem.type === 'custom' &&
            (currentItem as CustomItem).tooltip.config
        ) {
            setTimeout(() => {
                const selectedNode = stageRef.current?.findOne('#tooltip-' + currentItem.id);
                if (selectedNode) {
                    tooltipTransformerRef.current?.nodes([selectedNode]);
                } else {
                    tooltipTransformerRef.current?.nodes([]);
                }
            }, 10);
        }
    }, [currentItem, stageRef, transformerRef, tooltipTransformerRef, currentItem?.version]);

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
                    ...structuredClone(DEFAULT_RECTANGLE),
                    id: createCUID(),
                    position: { x: pos.x, y: pos.y },
                    strokeColor: isDark ? '#ffffff' : '#000000',
                };
                setPreviewItem(newItem);
            } else if (selectedTool === 'diamond') {
                setIsDrawing(true);
                const newItem: RectangleItem = {
                    ...structuredClone(DEFAULT_DIAMOND),
                    id: createCUID(),
                    position: { x: pos.x, y: pos.y },
                    strokeColor: isDark ? '#ffffff' : '#000000',
                };
                setPreviewItem(newItem);
            } else if (selectedTool === 'circle') {
                setIsDrawing(true);
                const newItem: CircleItem = {
                    ...structuredClone(DEFAULT_CIRCLE),
                    id: createCUID(),
                    position: { x: pos.x, y: pos.y },
                    strokeColor: isDark ? '#ffffff' : '#000000',
                };
                setPreviewItem(newItem);
            } else if (selectedTool === 'text') {
                setIsDrawing(true);
                const newItem: TextItem = {
                    ...structuredClone(DEFAULT_TEXT),
                    id: createCUID(),
                    position: { x: pos.x, y: pos.y },
                    fillColor: isDark ? '#ffffff' : '#000000',
                };
                setPreviewItem(newItem);
            } else if (selectedTool === 'line') {
                setIsDrawing(true);
                const newItem: LineItem = {
                    ...structuredClone(DEFAULT_LINE),
                    points: [pos.x, pos.y, pos.x, pos.y],
                    id: createCUID(),
                    strokeColor: isDark ? '#ffffff' : '#000000',
                };
                setPreviewItem(newItem);
            } else if (selectedTool === 'arrow') {
                setIsDrawing(true);
                const newItem: LineItem = {
                    ...structuredClone(DEFAULT_ARROW),
                    points: [pos.x, pos.y, pos.x, pos.y],
                    id: createCUID(),
                    strokeColor: isDark ? '#ffffff' : '#000000',
                };
                setPreviewItem(newItem);
            } else if (selectedTool === 'image') {
                setIsDrawing(true);
                const newItem: ImageItem = {
                    ...structuredClone(DEFAULT_IMAGE),
                    id: createCUID(),
                    position: { x: pos.x, y: pos.y },
                };
                setPreviewItem(newItem);
            } else if (selectedTool === 'draw') {
                setIsDrawing(true);
                const newItem: DrawItem = {
                    ...structuredClone(DEFAULT_DRAW),
                    points: [pos.x, pos.y, pos.x, pos.y],
                    id: createCUID(),
                    strokeColor: isDark ? '#ffffff' : '#000000',
                };
                setPreviewItem(newItem);
            } else if (selectedTool === 'custom') {
                setIsDrawing(true);
                const newItem: CustomItem = {
                    ...structuredClone(DEFAULT_CUSTOM),
                    id: createCUID(),
                    position: { x: pos.x, y: pos.y },
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
                            width: Math.max(5, x - previewItem.position.x),
                            height: Math.max(5, y - previewItem.position.y),
                        },
                    } as RectangleItem | CircleItem | TextItem);
                    break;
                case 'image':
                case 'custom':
                    setPreviewItem({
                        ...previewItem,
                        size: {
                            width: Math.max(5, x - previewItem.position.x),
                            height: Math.max(5, y - previewItem.position.y),
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
            dispatch(setSelectedItem(previewItem.id));
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
            style={{ paddingTop: '90px', backgroundColor: board.backgroundColor ?? 'var(--background-base)' }}
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
