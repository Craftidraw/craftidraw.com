import React from 'react';
import { type RectangleItem } from '~/types/item';
import { Rect } from 'react-konva';

interface CraftiRectangleProps {
    item: RectangleItem;
}

const CraftiRectanglePreview: React.FC<CraftiRectangleProps> = ({ item }) => {
    return (
        <Rect
            x={item.position.x}
            y={item.position.y}
            width={item.size.width}
            height={item.size.height}
            stroke={item.strokeColor ? item.strokeColor : 'black'}
            itemType={item.type}
            draggable
        />
    );
};

export default CraftiRectanglePreview;
