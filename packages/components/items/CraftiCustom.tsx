import type { RootState } from '~/lib/store/store';
import { useItem } from '~/hooks/useItem';
import React, { useState } from 'react';
import useImage from 'use-image';
import { Group, Image as KonvaImage, Rect } from 'react-konva';
import type { CustomItem } from '~/types/item';
import { setIsLibraryOpen } from '~/lib/store/features/appSlice';
import { useAppSelector, useAppDispatch } from '~/lib/store/hooks';
import ItemTooltip from '../ui/item/ItemTooltip';

interface CraftiCustomProps {
    item: CustomItem;
}

const CraftiCustom: React.FC<CraftiCustomProps> = ({ item }) => {
    const dispatch = useAppDispatch();
    const { selectItem, moveItemStart, moveItem, moveItemEnd, transformItemStart, transformItem, transformItemEnd } = useItem();
    const [image, status] = useImage(item.image?.data ?? '');
    const selectedItem = useAppSelector((state: RootState) => state.app.selectedItem);
    const [showTooltip, setShowTooltip] = useState(false);

    const handleImageSelect = () => {
        dispatch(setIsLibraryOpen(true));
    };

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
            {item.image && image && status === 'loaded' ? (
                <KonvaImage
                    key={item.id}
                    id={item.id}
                    itemType={item.type}
                    x={item.position.x}
                    y={item.position.y}
                    width={item.size.width}
                    height={item.size.height}
                    image={image}
                    onClick={(e) => selectItem(e, item)}
                    onTransformStart={() => transformItemStart(item)}
                    onTransform={(e) => transformItem(e, item)}
                    onTransformEnd={() => transformItemEnd(item)}
                    onDragStart={() => moveItemStart(item)}
                    onDragMove={(e) => moveItem(e, item)}
                    onDragEnd={() => moveItemEnd(item)}
                    onMouseOver={() => setShowTooltip(true)}
                    onMouseOut={() => setShowTooltip(false)}
                    draggable={selectedItem === item.id}
                />
            ) : (
                <Rect
                    key={item.id}
                    id={item.id}
                    itemType={item.type}
                    x={item.position.x}
                    y={item.position.y}
                    width={item.size.width}
                    height={item.size.height}
                    stroke='gray'
                    fill='lightgray'
                    dash={[5, 5]}
                    cornerRadius={5}
                    onClick={(e) => selectItem(e, item)}
                    onDblClick={() => handleImageSelect()}
                    onTransformStart={() => transformItemStart(item)}
                    onTransform={(e) => transformItem(e, item)}
                    onTransformEnd={() => transformItemEnd(item)}
                    onDragStart={() => moveItemStart(item)}
                    onDragMove={(e) => moveItem(e, item)}
                    onDragEnd={() => moveItemEnd(item)}
                    draggable={selectedItem === item.id}
                />
            )}
            {(item.showTooltip ?? showTooltip) && item.tooltip?.config && <ItemTooltip item={item} />}
        </Group>
    );
};

export default CraftiCustom;
