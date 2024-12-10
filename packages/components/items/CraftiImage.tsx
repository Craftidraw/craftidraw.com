import { Group, Image as KonvaImage, Rect } from 'react-konva';
import React from 'react';
import type { RootState } from '~/lib/store/store';
import type { Item, ImageItem } from '~/types/item';
import { useItem } from '~/hooks/useItem';
import useImage from 'use-image';
import { setIsLibraryOpen } from '~/lib/store/features/appSlice';
import { useAppSelector, useAppDispatch } from '~/lib/store/hooks';

interface CraftiImageProps {
    item: ImageItem;
}

const CraftiImage: React.FC<CraftiImageProps> = ({ item }) => {
    const dispatch = useAppDispatch();
    const selectedItem: Item | null = useAppSelector((state: RootState) => state.app.selectedItem);
    const { selectItem, moveItemStart, moveItem, moveItemEnd, transformItemStart, transformItem, transformItemEnd } =
        useItem();
    const [image, status] = useImage(item.image?.data ?? '');

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
                    stroke={item.isStrokeEnabled && item.strokeColor ? item.strokeColor : 'transparent'}
                    strokeWidth={item.isStrokeEnabled && item.strokeWidth ? item.strokeWidth : 1}
                    dashEnabled={item.strokeStyle !== 'solid'}
                    dash={item.strokeStyle === 'dashed' ? [15, 15] : [5, 5]}
                    cornerRadius={item.borderRadius ? item.borderRadius : 0}
                    image={image}
                    onClick={(e) => selectItem(e, item)}
                    onTransformStart={() => transformItemStart(item)}
                    onTransform={(e) => transformItem(e, item)}
                    onTransformEnd={() => transformItemEnd(item)}
                    onDragStart={() => moveItemStart(item)}
                    onDragMove={(e) => moveItem(e, item)}
                    onDragEnd={() => moveItemEnd(item)}
                    draggable={selectedItem?.id === item.id}
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
                    onDblClick={(e) => handleImageSelect()}
                    onTransformStart={() => transformItemStart(item)}
                    onTransform={(e) => transformItem(e, item)}
                    onTransformEnd={() => transformItemEnd(item)}
                    onDragStart={() => moveItemStart(item)}
                    onDragMove={(e) => moveItem(e, item)}
                    onDragEnd={() => moveItemEnd(item)}
                    draggable={selectedItem?.id === item.id}
                />
            )}
        </Group>
    );
};

export default CraftiImage;
