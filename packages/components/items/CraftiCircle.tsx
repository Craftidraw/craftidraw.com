import React from 'react';
import { type RootState } from '~/lib/store/store';
import { Ellipse, Group } from 'react-konva';
import { useItem } from '~/hooks/useItem';
import { type CircleItem, type Item } from '~/types/item';
import { useAppSelector } from '~/lib/store/hooks';

interface CraftiCircleProps {
    item: CircleItem;
}

const CraftiCircle: React.FC<CraftiCircleProps> = ({ item }) => {
    const selectedItem: Item | null = useAppSelector((state: RootState) => state.app.selectedItem);
    const { selectItem, moveItemStart, moveItem, moveItemEnd, transformItemStart, transformItem, transformItemEnd } =
        useItem();

    return (
        <Group>
            <Ellipse
                key={item.id + '-attachment-zone'}
                id={item.id + '-attachment-zone'}
                x={item.position.x}
                y={item.position.y}
                offsetX={-(item.size.width / 2)}
                offsetY={-(item.size.height / 2)}
                width={item.size.width}
                height={item.size.height}
                radiusX={item.size.width / 2 + 15}
                radiusY={item.size.height / 2 + 15}
                opacity={0.3}
            />
            <Ellipse
                key={item.id}
                id={item.id}    
                itemType={item.type}
                x={item.position.x}
                y={item.position.y}
                offsetX={-(item.size.width / 2)}
                offsetY={-(item.size.height / 2)}
                width={item.size.width}
                height={item.size.height}
                radiusX={item.size.width / 2}
                radiusY={item.size.height / 2}
                stroke={item.isStokeEnabled && item.strokeColor ? item.strokeColor : 'transparent'}
                strokeWidth={item.isStokeEnabled && item.strokeWidth ? item.strokeWidth : 1}
                dashEnabled={item.strokeStyle !== 'solid'}
                dash={item.strokeStyle === 'dashed' ? [15, 15] : [5, 5]}
                fill={item.isFillEnabled && item.fillColor ? item.fillColor : 'transparent'}
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

export default CraftiCircle;
