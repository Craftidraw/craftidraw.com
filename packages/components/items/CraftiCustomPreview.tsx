import { type CustomItem } from '~/types/item';
import { Group, Rect } from 'react-konva';
import React from 'react';

interface CraftiCustomPreviewProps {
    item: CustomItem;
}

const CraftiCustomPreview: React.FC<CraftiCustomPreviewProps> = ({ item }) => {
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

export default CraftiCustomPreview;
