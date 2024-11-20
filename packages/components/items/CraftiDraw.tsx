import React from 'react';
import { type RootState } from '~/lib/store/store';
import { Line } from 'react-konva';
import { useItem } from '~/hooks/useItem';
import type Konva from 'konva';
import { type DrawItem, type Item } from '~/types/item';
import { useAppSelector } from '~/lib/store/hooks';

interface CraftiDrawProps {
    item: DrawItem;
}

const CraftiDraw: React.FC<CraftiDrawProps> = ({ item }) => {
    const selectedItem: Item | null = useAppSelector((state: RootState) => state.app.selectedItem);
    const { selectItem, moveItemStart, moveItem, moveItemEnd, transformItemStart, transformItem, transformItemEnd } =
        useItem();
    const lineRef = React.useRef<Konva.Line | Konva.Arrow>(null);

    return (
        <Line
            ref={lineRef}
            key={item.id}
            id={item.id}
            x={item.position.x}
            y={item.position.y}
            points={item.points}
            stroke={item.isStokeEnabled && item.strokeColor ? item.strokeColor : 'transparent'}
            strokeWidth={item.isStokeEnabled && item.strokeWidth ? item.strokeWidth : 1}
            dashEnabled={item.strokeStyle !== 'solid'}
            dash={item.strokeStyle === 'dashed' ? [15, 15] : [5, 5]}
            itemType={item.type}
            lineCap='round'
            lineJoin='round'
            onClick={(e) => selectItem(e, item)}
            onTransformStart={() => transformItemStart(item)}
            onTransform={(e) => transformItem(e, item)}
            onTransformEnd={() => transformItemEnd(item)}
            onDragStart={() => moveItemStart(item)}
            onDragMove={(e) => moveItem(e, item)}
            onDragEnd={() => moveItemEnd(item)}
            draggable={selectedItem?.id === item.id}
        />
    );
};

export default CraftiDraw;
