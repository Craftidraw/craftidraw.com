import React from 'react';
import { type CircleItem } from '~/types/item';
import { Ellipse } from 'react-konva';

interface CraftiCircleProps {
    item: CircleItem;
}

const CraftiCirclePreview: React.FC<CraftiCircleProps> = ({ item }) => {
    return (
        <Ellipse
            x={item.position.x}
            y={item.position.y}
            offsetX={-(item.size.width / 2)}
            offsetY={-(item.size.height / 2)}
            width={item.size.width}
            height={item.size.height}
            radiusX={item.size.width / 2}
            radiusY={item.size.height / 2}
            stroke={item.strokeColor ? item.strokeColor : 'black'}
            itemType={item.type}
        />
    );
};

export default CraftiCirclePreview;
