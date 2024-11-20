import React from 'react';
import { Text } from 'react-konva';
import { type TextItem } from '~/types/item';

interface CraftiTextPreviewProps {
    item: TextItem;
}

const CraftiText: React.FC<CraftiTextPreviewProps> = ({ item }) => {
    return (
        <Text
            key={item.id}
            id={item.id}
            x={item.position.x}
            y={item.position.y}
            height={item.size.height}
            width={item.size.width}
            text={item.text}
            fontSize={item.fontSize}
            fontStyle={item.fontEffect}
            itemType={item.type}
            draggable
        />
    );
};

export default CraftiText;
