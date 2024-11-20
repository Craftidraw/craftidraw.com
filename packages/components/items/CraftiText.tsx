import { type RootState } from '~/lib/store/store';
import React from 'react';
import { Group, Rect, Text } from 'react-konva';
import { useItem } from '~/hooks/useItem';
import { type Item, type TextItem } from '~/types/item';
import { useAppSelector } from '~/lib/store/hooks';

interface CraftiTextProps {
    item: TextItem;
}

const CraftiText: React.FC<CraftiTextProps> = ({ item }) => {
    const selectedItem: Item | null = useAppSelector((state: RootState) => state.app.selectedItem);
    const { selectItem, moveItemStart, moveItem, moveItemEnd, transformItemStart, transformItem, transformItemEnd } =
        useItem();

    return (
        <Group>
            <Rect
                key={item.id + '-attachment-zone'}
                id={item.id + '-attachment-zone'}
                x={item.position.x - 15}
                y={item.position.y - 15}
                width={item.size.width + 30}
                height={item.size.height + 30}
                opacity={0.3}
            />
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
                textDecoration={item.fontDecoration === 'none' ? '' : item.fontDecoration}
                fontFamily={item.fontFamily}
                align={item.textAlign}
                stroke={item.isStokeEnabled && item.strokeColor ? item.strokeColor : 'transparent'}
                fill={item.isFillEnabled && item.fillColor ? item.fillColor : 'transparent'}
                itemType={item.type}
                onClick={(e) => selectItem(e, item)}
                onTransformStart={() => transformItemStart(item)}
                onTransform={(e) => transformItem(e, item)}
                onTransformEnd={() => transformItemEnd(item)}
                onDragStart={() => moveItemStart(item)}
                onDragMove={(e) => moveItem(e, item)}
                onDragEnd={() => moveItemEnd(item)}
                draggable={selectedItem?.id === item.id}
            />
        </Group>
    );
};

export default CraftiText;
