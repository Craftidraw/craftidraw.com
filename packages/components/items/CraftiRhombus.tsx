import React from 'react';
import { type RootState } from '~/lib/store/store';
import { Group, Line } from 'react-konva';
import { useItem } from '~/hooks/useItem';
import { type Item, type RectangleItem } from '~/types/item';
import { useAppSelector } from '~/lib/store/hooks';

interface CraftiRhombusProps {
    item: RectangleItem;
}

const CraftiRhombus: React.FC<CraftiRhombusProps> = ({ item }) => {
    const selectedItem: Item | null = useAppSelector((state: RootState) => state.app.selectedItem);
    const { selectItem, moveItemStart, moveItem, moveItemEnd, transformItemStart, transformItem, transformItemEnd } =
        useItem();

    return (
        <Group>
            <Line
                key={item.id + '-attachment-zone'}
                id={item.id + '-attachment-zone'}
                x={item.position.x}
                y={item.position.y}
                width={item.size.width}
                height={item.size.height}
                points={[
                    item.size.width / 2,
                    -15,
                    item.size.width + 15,
                    item.size.height / 2,
                    item.size.width / 2,
                    item.size.height + 15,
                    -15,
                    item.size.height / 2,
                    item.size.width / 2,
                    -15,
                ]}
                closed={true}
                opacity={0.3}
            />
            <Line
                key={item.id}
                id={item.id}
                itemType={item.type}
                x={item.position.x}
                y={item.position.y}
                width={item.size.width}
                height={item.size.height}
                points={[
                    item.size.width / 2,
                    0,
                    item.size.width,
                    item.size.height / 2,
                    item.size.width / 2,
                    item.size.height,
                    0,
                    item.size.height / 2,
                    item.size.width / 2,
                    0,
                ]}
                closed={true}
                stroke={item.isStokeEnabled && item.strokeColor ? item.strokeColor : 'transparent'}
                strokeWidth={item.isStokeEnabled && item.strokeWidth ? item.strokeWidth : 1}
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

export default CraftiRhombus;
