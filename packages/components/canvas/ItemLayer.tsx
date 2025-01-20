'use client';

import type { RootState } from '~/lib/store/store';
import type {
    CircleItem,
    CustomItem,
    DrawItem,
    ImageItem,
    Item,
    LineItem,
    Position,
    RectangleItem,
    TextItem,
} from '~/types/item';
import CraftiRectangle from '../items/CraftiRectangle';
import CraftiCircle from '../items/CraftiCircle';
import CraftiLine from '../items/CraftiLine';
import CraftiText from '../items/CraftiText';
import CraftiRectanglePreview from '../items/CraftiRectanglePreview';
import CraftiCirclePreview from '../items/CraftiCirclePreview';
import CraftiLinePreview from '../items/CraftiLinePreview';
import CraftiTextPreview from '../items/CraftiTextPreview';
import CraftiImage from '../items/CraftiImage';
import CraftiImagePreview from '../items/CraftiImagePreview';
import CraftiArrow from '../items/CraftiArrow';
import CraftiArrowPreview from '../items/CraftiArrowPreview';
import CraftiDraw from '../items/CraftiDraw';
import CraftiDrawPreview from '../items/CraftiDrawPreview';
import CraftiCustom from '../items/CraftiCustom';
import CraftiCustomPreview from '../items/CraftiCustomPreview';
import CraftiRhombus from '../items/CraftiRhombus';
import { Circle, Layer, Transformer } from 'react-konva';
import React, { useCallback, useEffect, useState } from 'react';
import { useItem } from '~/hooks/useItem';
import { selectAllItems, selectItemById } from '~/lib/store/features/appSlice';
import { useAppSelector } from '~/lib/store/hooks';
import { useStage } from '~/providers/StageProvider';

interface ItemLayerProps {
    previewItem: Item | null;
}

const ItemLayer: React.FC<ItemLayerProps> = ({ previewItem }) => {
    const { itemLayerRef, transformerRef, tooltipTransformerRef } = useStage();
    const { moveAnchorStart, moveAnchor, moveAnchorEnd } = useItem();

    const selectedItem = useAppSelector((state: RootState) => state.app.selectedItem);
    const currentItem = useAppSelector((state: RootState) => selectItemById(state, selectedItem ?? ''));
    const items = useAppSelector(selectAllItems);

    const [anchors, setAnchors] = useState<{ x: number; y: number }[]>([]);

    const updateAnchors = useCallback(() => {
        if (currentItem?.type === 'line' || currentItem?.type === 'arrow') {
            const lineItem = currentItem as LineItem;
            const newAnchors = lineItem.points.reduce((acc: Position[], point, index) => {
                if (index % 2 === 0) {
                    const relativeX = lineItem.position.x ?? 0;
                    const relativeY = lineItem.position.y ?? 0;
                    acc.push({ x: point + relativeX, y: lineItem.points[index + 1]! + relativeY });
                }
                return acc;
            }, []);
            setAnchors(newAnchors);
        } else {
            setAnchors([]);
        }
    }, [currentItem]);

    useEffect(() => {
        updateAnchors();
    }, [selectedItem, updateAnchors]);

    return (
        <Layer id='itemLayer' ref={itemLayerRef}>
            {itemLayerRef.current &&
                items?.map((item) => {
                    if (item.type === 'rectangle') {
                        return <CraftiRectangle key={item.id} item={item as RectangleItem} />;
                    } else if (item.type === 'circle') {
                        return <CraftiCircle key={item.id} item={item as CircleItem} />;
                    } else if (item.type === 'line') {
                        return <CraftiLine key={item.id} item={item as LineItem} />;
                    } else if (item.type === 'arrow') {
                        return <CraftiArrow key={item.id} item={item as LineItem} />;
                    } else if (item.type === 'text') {
                        return <CraftiText key={item.id} item={item as TextItem} />;
                    } else if (item.type === 'image') {
                        return <CraftiImage key={item.id} item={item as ImageItem} />;
                    } else if (item.type === 'draw') {
                        return <CraftiDraw key={item.id} item={item as DrawItem} />;
                    } else if (item.type === 'custom') {
                        return <CraftiCustom key={item.id} item={item as CustomItem} />;
                    } else if (item.type === 'diamond') {
                        return <CraftiRhombus key={item.id} item={item as RectangleItem} />;
                    }
                    return null;
                })}
            {itemLayerRef.current &&
                previewItem &&
                (previewItem.type === 'rectangle' ? (
                    <CraftiRectanglePreview key={previewItem.id + '-preview'} item={previewItem as RectangleItem} />
                ) : previewItem.type === 'circle' ? (
                    <CraftiCirclePreview key={previewItem.id + '-preview'} item={previewItem as CircleItem} />
                ) : previewItem.type === 'line' ? (
                    <CraftiLinePreview key={previewItem.id + '-preview'} item={previewItem as LineItem} />
                ) : previewItem.type === 'arrow' ? (
                    <CraftiArrowPreview key={previewItem.id + 'preview'} item={previewItem as LineItem} />
                ) : previewItem.type === 'text' ? (
                    <CraftiTextPreview key={previewItem.id + 'preview'} item={previewItem as TextItem} />
                ) : previewItem.type === 'image' ? (
                    <CraftiImagePreview key={previewItem.id + 'preview'} item={previewItem as ImageItem} />
                ) : previewItem.type === 'draw' ? (
                    <CraftiDrawPreview key={previewItem.id + 'preview'} item={previewItem as DrawItem} />
                ) : previewItem.type === 'custom' ? (
                    <CraftiCustomPreview key={previewItem.id + 'preview'} item={previewItem as CustomItem} />
                ) : previewItem.type === 'diamond' ? (
                    <CraftiRhombus key={previewItem.id + 'preview'} item={previewItem as RectangleItem} />
                ) : null)}
            {itemLayerRef.current && currentItem?.type !== 'line' && currentItem?.type !== 'arrow' && (
                <Transformer
                    ref={transformerRef}
                    anchorCornerRadius={2}
                    padding={8}
                    anchorStroke={'#2e9f7e'}
                    anchorStrokeWidth={2}
                    borderStroke={'#2e9f7e'}
                    borderStrokeWidth={2}
                />
            )}
            {itemLayerRef.current && currentItem?.type === 'custom' && (currentItem as CustomItem).tooltip.config && (
                <Transformer
                    ref={tooltipTransformerRef}
                    anchorCornerRadius={2}
                    padding={8}
                    anchorStroke={'#2e9f7e'}
                    anchorStrokeWidth={2}
                    borderStroke={'#2e9f7e'}
                    borderStrokeWidth={2}
                    rotateEnabled={false}
                />
            )}
            {itemLayerRef.current &&
                (currentItem?.type === 'line' || currentItem?.type === 'arrow') &&
                anchors.map((anchor, index) => (
                    <Circle
                        key={`anchor-${index}`}
                        id={`anchor-${index}`}
                        x={anchor.x}
                        y={anchor.y}
                        radius={4}
                        stroke={'#76C89F'}
                        strokeWidth={2}
                        cornerRadius={1}
                        fill={'white'}
                        draggable
                        onDragStart={() => moveAnchorStart(currentItem as LineItem)}
                        onDragMove={(e) => moveAnchor(index, e, currentItem as LineItem)}
                        onDragEnd={() => moveAnchorEnd(index, currentItem as LineItem)}
                    />
                ))}
        </Layer>
    );
};

export default ItemLayer;
