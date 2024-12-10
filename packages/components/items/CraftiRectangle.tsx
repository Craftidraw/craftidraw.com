import React from 'react';
import { type RootState } from '~/lib/store/store';
import { type Item, type RectangleItem } from '~/types/item';
import { Group, Rect } from 'react-konva';
import { useItem } from '~/hooks/useItem';
import { useAppSelector } from '~/lib/store/hooks';

interface CraftiRectangleProps {
    item: RectangleItem;
}

const CraftiRectangle: React.FC<CraftiRectangleProps> = ({ item }) => {
    const selectedItem: Item | null = useAppSelector((state: RootState) => state.app.selectedItem);
    const { selectItem, moveItemStart, moveItem, moveItemEnd, transformItemStart, transformItem, transformItemEnd } =
        useItem();

    return (
        <Group>
            <Rect
                key={item.id + '-attachment-zone'}
                id={item.id + '-attachment-zone'}
                x={item.position.x - 15}
                y={item.position.y - 15}
                width={item.size.width + 30}
                height={item.size.height + 30}
                opacity={0.3}
            />
            <Rect
                key={item.id}
                id={item.id}
                itemType={item.type}
                x={item.position.x}
                y={item.position.y}
                width={item.size.width}
                height={item.size.height}
                stroke={item.isStrokeEnabled && item.strokeColor ? item.strokeColor : 'transparent'}
                strokeWidth={item.isStrokeEnabled && item.strokeWidth ? item.strokeWidth : 1}
                dashEnabled={item.strokeStyle !== 'solid'}
                dash={item.strokeStyle === 'dashed' ? [15, 15] : [5, 5]}
                fill={item.isFillEnabled && item.fillColor ? item.fillColor : 'transparent'}
                cornerRadius={item.borderRadius ? item.borderRadius : 0}
                onClick={(e) => selectItem(e, item)}
                onTransformStart={() => transformItemStart(item)}
                onTransform={(e) => transformItem(e, item)}
                onTransformEnd={() => transformItemEnd(item)}
                onDragStart={() => moveItemStart(item)}
                onDragMove={(e) => moveItem(e, item)}
                onDragEnd={() => moveItemEnd(item)}
                draggable={selectedItem?.id === item.id}
            />
        </Group>
    );
};

export default CraftiRectangle;
