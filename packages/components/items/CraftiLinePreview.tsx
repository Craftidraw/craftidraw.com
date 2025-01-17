import { type LineItem } from '~/types/item';
import { Line } from 'react-konva';
import React from 'react';

interface CraftiLineProps {
    item: LineItem;
}

const CraftiLinePreview: React.FC<CraftiLineProps> = ({ item }) => {
    return (
        <Line
            x={item.position.x}
            y={item.position.y}
            points={item.points}
            stroke={item.strokeColor ? item.strokeColor : 'black'}
            itemType={item.type}
        />
    );
};

export default CraftiLinePreview;
