import React from 'react';
import { type DrawItem } from '~/types/item';
import { Line } from 'react-konva';

interface CraftiDrawProps {
    item: DrawItem;
}

const CraftiDrawPreview: React.FC<CraftiDrawProps> = ({ item }) => {
    return (
        <Line
            key={item.id}
            id={item.id}
            x={item.position.x}
            y={item.position.y}
            points={item.points}
            stroke={item.isStrokeEnabled && item.strokeColor ? item.strokeColor : 'transparent'}
            strokeWidth={item.isStrokeEnabled && item.strokeWidth ? item.strokeWidth : 1}
            itemType={item.type}
            lineCap='round'
            lineJoin='round'
        />
    );
};

export default CraftiDrawPreview;
