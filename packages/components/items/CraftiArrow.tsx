import React from 'react';
import type { RootState } from '~/lib/store/store';
import { Arrow } from 'react-konva';
import { useItem } from '~/hooks/useItem';
import type Konva from 'konva';
import type { Item, LineItem } from '~/types/item';
import { useAppSelector } from '~/lib/store/hooks';

interface CraftiArrowProps {
    item: LineItem;
}

const CraftiArrow: React.FC<CraftiArrowProps> = ({ item }) => {
    const selectedItem: Item | null = useAppSelector((state: RootState) => state.app.selectedItem);
    const { selectItem, moveItemStart, moveItem, moveItemEnd, transformItemStart, transformItem, transformItemEnd } = useItem();
    const arrowRef = React.useRef<Konva.Line | Konva.Arrow>(null);

    return (
        <Arrow
            ref={arrowRef as React.RefObject<Konva.Arrow>}
            key={item.id}
            id={item.id}
            x={item.position.x}
            y={item.position.y}
            points={item.points}
            stroke={item.isStokeEnabled && item.strokeColor ? item.strokeColor : 'transparent'}
            strokeWidth={item.isStokeEnabled && item.strokeWidth ? item.strokeWidth : 1}
            dashEnabled={item.strokeStyle !== 'solid'}
            dash={item.strokeStyle === 'dashed' ? [15, 15] : [5, 5]}
            fill={item.isFillEnabled && item.isArrow ? item.fillColor : 'transparent'}
            itemType={item.type}
            onClick={(e) => selectItem(e, item)}
            onTransformStart={() => transformItemStart(item)}
            onTransform={(e) => transformItem(e, item)}
            onTransformEnd={() => transformItemEnd(item)}
            onDragStart={() => moveItemStart(item)}
            onDragMove={(e) => moveItem(e, item)}
            onDragEnd={(e) => moveItemEnd(item)}
            draggable={selectedItem?.id === item.id}
            pointerAtBeginning={item.hasArrowTail}
            pointerAtEnding={item.hasArrowHead}
        />
    );
};

export default CraftiArrow;