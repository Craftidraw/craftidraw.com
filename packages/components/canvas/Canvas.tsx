'use client';

import React, { useEffect, useState } from 'react';
import { Stage } from 'react-konva';
import { addItem, addToHistory, setSelectedItem, setSelectedTool } from '~/lib/store/features/appSlice';
import type Konva from 'konva';
import GridLayer from './GridLayer';
import ItemLayer from './ItemLayer';
import type {
    CircleItem,
    CustomItem,
    DrawItem,
    ImageItem,
    Item,
    LineItem,
    RectangleItem,
    TextItem,
    TooltipLine,
} from '~/types/item';
import type { RootState } from '~/lib/store/store';
import createCUID from '~/lib/cuid/createCUID';
import { useAppDispatch, useAppSelector } from '~/lib/store/hooks';
import { useZoom } from '~/hooks/useZoom';
import { useShortcut } from '~/hooks/useShortcut';
import { useStage } from '~/providers/StageProvider';

const Canvas = () => {
    const dispatch = useAppDispatch();
    const { useKeyPress, useKeyRelease, cut, paste, redo, copy, remove, undo, quickMoveUp, quickMoveDown } =
        useShortcut();
    const { stageRef, transformerRef } = useStage();

    const selectedTool = useAppSelector((state: RootState) => state.app.selectedTool);
    const selectedItem: Item | null = useAppSelector((state: RootState) => state.app.selectedItem);
    const board = useAppSelector((state: RootState) => state.app.board);
    const isCustomExportsOpen = useAppSelector((state: RootState) => state.app.isCustomExportsOpen);

    const [isDrawing, setIsDrawing] = useState(false);
    const [previewItem, setPreviewItem] = useState<Item | null>(null);

    useEffect(() => {
        if (selectedItem && transformerRef.current) {
            const stage = transformerRef.current.getStage();
            const selectedNode = stage?.findOne('#' + selectedItem.id);
            if (selectedNode) {
                transformerRef.current.nodes([selectedNode]);
            } else {
                transformerRef.current.nodes([]);
            }
        } else {
            transformerRef.current?.nodes([]);
        }
    }, [selectedItem]);

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
                    id: createCUID(),
                    type: 'rectangle',
                    position: { x: pos.x, y: pos.y },
                    size: { width: 0, height: 0 },
                    isStrokeable: true,
                    isStokeEnabled: true,
                    strokeColor: '#000000',
                    strokeStyle: 'solid',
                    isFillable: true,
                    fillColor: '#000000',
                };
                setPreviewItem(newItem);
            } else if (selectedTool === 'diamond') {
                setIsDrawing(true);
                const newItem: RectangleItem = {
                    id: createCUID(),
                    type: 'diamond',
                    position: { x: pos.x, y: pos.y },
                    size: { width: 0, height: 0 },
                    isStrokeable: true,
                    isStokeEnabled: true,
                    strokeColor: '#000000',
                    strokeStyle: 'solid',
                    isFillable: true,
                    fillColor: '#000000',
                };
                setPreviewItem(newItem);
            } else if (selectedTool === 'circle') {
                setIsDrawing(true);
                const newItem: CircleItem = {
                    id: createCUID(),
                    type: 'circle',
                    position: { x: pos.x, y: pos.y },
                    size: { width: 0, height: 0 },
                    isStrokeable: true,
                    isStokeEnabled: true,
                    strokeStyle: 'solid',
                    strokeColor: '#000000',
                    isFillable: true,
                    fillColor: '#000000',
                };
                setPreviewItem(newItem);
            } else if (selectedTool === 'text') {
                setIsDrawing(true);
                const newItem: TextItem = {
                    id: createCUID(),
                    type: 'text',
                    position: { x: pos.x, y: pos.y },
                    size: { width: 0, height: 0 },
                    text: 'New Text',
                    fontEffect: 'normal',
                    isStrokeable: true,
                    isStokeEnabled: false,
                    strokeColor: '#000000',
                    isFillable: true,
                    isFillEnabled: true,
                    fillColor: '#000000',
                    textAlign: 'left',
                    fontSize: 18,
                };
                setPreviewItem(newItem);
            } else if (selectedTool === 'line') {
                setIsDrawing(true);
                const newItem: LineItem = {
                    id: createCUID(),
                    type: 'line',
                    position: { x: 0, y: 0 },
                    points: [pos.x, pos.y, pos.x, pos.y],
                    isStrokeable: true,
                    isStokeEnabled: true,
                    strokeColor: '#000000',
                    strokeStyle: 'solid',
                    isFillable: true,
                    isFillEnabled: true,
                    fillColor: '#000000',
                    isArrow: false,
                };
                setPreviewItem(newItem);
            } else if (selectedTool === 'arrow') {
                setIsDrawing(true);
                const newItem: LineItem = {
                    id: createCUID(),
                    type: 'arrow',
                    position: { x: 0, y: 0 },
                    points: [pos.x, pos.y, pos.x, pos.y],
                    isStrokeable: true,
                    isStokeEnabled: true,
                    strokeColor: '#000000',
                    strokeStyle: 'solid',
                    isFillable: true,
                    isFillEnabled: true,
                    fillColor: '#000000',
                    isArrow: true,
                    hasArrowTail: false,
                    hasArrowHead: true,
                };
                setPreviewItem(newItem);
            } else if (selectedTool === 'image') {
                setIsDrawing(true);
                const newItem: ImageItem = {
                    id: createCUID(),
                    type: 'image',
                    position: { x: pos.x, y: pos.y },
                    size: { width: 0, height: 0 },
                    isStrokeable: true,
                    strokeColor: '#000000',
                    strokeStyle: 'solid',
                    isFillable: false,
                };
                setPreviewItem(newItem);
            } else if (selectedTool === 'draw') {
                setIsDrawing(true);
                const newItem: DrawItem = {
                    id: createCUID(),
                    type: 'draw',
                    position: { x: 0, y: 0 },
                    size: { width: e.target.getClientRect().width, height: e.target.getClientRect().height },
                    points: [pos.x, pos.y, pos.x, pos.y],
                    isStrokeable: true,
                    isStokeEnabled: true,
                    strokeStyle: 'solid',
                    strokeColor: '#000000',
                    isFillable: false,
                };
                setPreviewItem(newItem);
            } else if (selectedTool === 'custom') {
                setIsDrawing(true);
                const newItem: CustomItem = {
                    id: createCUID(),
                    type: 'custom',
                    entity: 'Custom-Item-Entity',
                    position: { x: pos.x, y: pos.y },
                    size: { width: 0, height: 0 },
                    isStrokeable: false,
                    isFillable: false,
                    displayName: {
                        text: 'Custom item',
                        fontSize: 14,
                    } as TooltipLine,
                    lore: [],
                };
                setPreviewItem(newItem);
            }
        }
    };

    const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (isDrawing && previewItem) {
            const pos = e.target.getStage()!.getRelativePointerPosition()!;
            if (selectedTool === 'rectangle' || selectedTool === 'diamond') {
                setPreviewItem({
                    ...previewItem,
                    size: { width: pos.x - previewItem.position.x, height: pos.y - previewItem.position.y },
                } as RectangleItem);
            } else if (selectedTool === 'circle') {
                setPreviewItem({
                    ...previewItem,
                    size: { width: pos.x - previewItem.position.x, height: pos.y - previewItem.position.y },
                } as CircleItem);
            } else if (selectedTool === 'text') {
                setPreviewItem({
                    ...previewItem,
                    size: { width: pos.x - previewItem.position.x, height: pos.y - previewItem.position.y },
                } as TextItem);
            } else if (selectedTool === 'line' || selectedTool === 'arrow') {
                setPreviewItem({
                    ...previewItem,
                    points: [(previewItem as LineItem).points[0], (previewItem as LineItem).points[1], pos.x, pos.y],
                } as LineItem);
            } else if (selectedTool === 'image') {
                setPreviewItem({
                    ...previewItem,
                    size: { width: pos.x - previewItem.position.x, height: pos.y - previewItem.position.y },
                } as ImageItem);
            } else if (selectedTool === 'draw') {
                const points = (previewItem as DrawItem).points;
                const newPoints = points.concat([pos.x, pos.y]);
                setPreviewItem({
                    ...previewItem,
                    points: newPoints,
                } as DrawItem);
            } else if (selectedTool === 'custom') {
                setPreviewItem({
                    ...previewItem,
                    size: { width: pos.x - previewItem.position.x, height: pos.y - previewItem.position.y },
                } as CustomItem);
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
                    currentSnapshot: { ...previewItem },
                }),
            );
            //requestItemSave();
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
