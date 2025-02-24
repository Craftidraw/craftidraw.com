import React from 'react';
import { type RootState } from '~/lib/store/store';
import { type LineItem } from '~/types/item';
import { Arrow, Line } from 'react-konva';
import { useItem } from '~/hooks/useItem';
import { useAppSelector } from '~/lib/store/hooks';

interface CraftiLineProps {
    item: LineItem;
}

const CraftiLine: React.FC<CraftiLineProps> = ({ item }) => {
    const selectedItem = useAppSelector((state: RootState) => state.app.selectedItem);
    const { selectItem, moveItemStart, moveItem, moveItemEnd, transformItemStart, transformItem, transformItemEnd } = useItem();

    return (
        <>
            {item.hasArrowHead || item.hasArrowTail ? (
                <>
                    <Arrow
                        key={item.id}
                        id={item.id}
                        x={item.position.x}
                        y={item.position.y}
                        points={item.points}
                        stroke={item.isStrokeEnabled && item.strokeColor ? item.strokeColor : 'transparent'}
                        strokeWidth={item.isStrokeEnabled && item.strokeWidth ? item.strokeWidth : 1}
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
                        onDragEnd={() => moveItemEnd(item)}
                        draggable={selectedItem === item.id}
                        pointerAtBeginning={item.hasArrowTail}
                        pointerAtEnding={item.hasArrowHead}
                    />
                </>
            ) : (
                <>
                    <Line
                        key={item.id}
                        id={item.id}
                        x={item.position.x}
                        y={item.position.y}
                        points={item.points}
                        stroke={item.isStrokeEnabled && item.strokeColor ? item.strokeColor : 'transparent'}
                        strokeWidth={item.isStrokeEnabled && item.strokeWidth ? item.strokeWidth : 1}
                        dashEnabled={item.strokeStyle !== 'solid'}
                        dash={item.strokeStyle === 'dashed' ? [15, 15] : [5, 5]}
                        itemType={item.type}
                        onClick={(e) => selectItem(e, item)}
                        onTransformStart={() => transformItemStart(item)}
                        onTransform={(e) => transformItem(e, item)}
                        onTransformEnd={() => transformItemEnd(item)}
                        onDragStart={() => moveItemStart(item)}
                        onDragMove={(e) => moveItem(e, item)}
                        onDragEnd={() => moveItemEnd(item)}
                        draggable={selectedItem === item.id}
                    />
                </>
            )}
        </>
    );
};

export default CraftiLine;
