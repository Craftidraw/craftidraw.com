import { type LineItem } from '~/types/item';
import { Arrow } from 'react-konva';
import React from 'react';

interface CraftiArrowProps {
    item: LineItem;
}

const CraftiArrowPreview: React.FC<CraftiArrowProps> = ({ item }) => {
    return (
        <Arrow
            x={item.position.x}
            y={item.position.y}
            points={item.points}
            stroke={item.isStokeEnabled && item.strokeColor ? item.strokeColor : 'transparent'}
            fill={item.isFillEnabled && item.isArrow ? item.fillColor : 'transparent'}
            itemType={item.type}
            pointerAtBeginning={item.hasArrowTail}
            pointerAtEnding={item.hasArrowHead}
            draggable
        />
    );
};

export default CraftiArrowPreview;
