import { type ImageItem } from '~/types/item';
import { Group, Rect } from 'react-konva';
import React from 'react';

interface CraftiImagePreviewProps {
    item: ImageItem;
}
const CraftiImagePreview: React.FC<CraftiImagePreviewProps> = ({ item }) => {
    return (
        <Group>
            <Rect
                x={item.position.x}
                y={item.position.y}
                itemType={item.type}
                width={item.size.width}
                height={item.size.height}
                stroke='gray'
                fill='lightgray'
                dash={[5, 5]}
                cornerRadius={5}
            />
        </Group>
    );
};

export default CraftiImagePreview;
