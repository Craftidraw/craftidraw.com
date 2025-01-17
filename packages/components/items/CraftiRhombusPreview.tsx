import React from 'react';
import { type RectangleItem } from '~/types/item';
import { Rect } from 'react-konva';

interface CraftiRhombusPreviewProps {
    item: RectangleItem;
}   

const CraftiRhombusPreview: React.FC<CraftiRhombusPreviewProps> = ({ item }) => {
    return (
        <Rect
            x={item.position.x}
            y={item.position.y}
            width={item.size.width}
            height={item.size.height}
            rotation={45}
            stroke={item.strokeColor ? item.strokeColor : 'black'}
            itemType={item.type}
        />
    );
};

export default CraftiRhombusPreview;
