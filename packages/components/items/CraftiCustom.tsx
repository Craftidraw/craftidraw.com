import type { RootState } from '~/lib/store/store';
import { useItem } from '~/hooks/useItem';
import React from 'react';
import useImage from 'use-image';
import { Group, Image as KonvaImage, Rect } from 'react-konva';
import type Konva from 'konva';
import { Html } from 'react-konva-utils';
import type { CustomItem, Item, TooltipLine } from '~/types/item';
import { setIsLibraryOpen } from '~/lib/store/features/appSlice';
import { useAppSelector, useAppDispatch } from '~/lib/store/hooks';

interface CraftiCustomProps {
    item: CustomItem;
}

const minecraftColorMap: Record<string, string> = {
    ...['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'].reduce((acc, key) => {
        const hex = [
            '#000000',
            '#0000AA',
            '#00AA00',
            '#00AAAA',
            '#AA0000',
            '#AA00AA',
            '#FFAA00',
            '#AAAAAA',
            '#555555',
            '#5555FF',
            '#55FF55',
            '#55FFFF',
            '#FF5555',
            '#FF55FF',
            '#FFFF55',
            '#FFFFFF',
        ][parseInt(key, 16)];
        return { ...acc, [`§${key}`]: hex, [`&${key}`]: hex };
    }, {}),
};

const CraftiCustom: React.FC<CraftiCustomProps> = ({ item }) => {
    const dispatch = useAppDispatch();
    const { selectItem, moveItemStart, moveItem, moveItemEnd, transformItemStart, transformItem, transformItemEnd } =
        useItem();
    const [image, status] = useImage(item.image?.data ?? '');
    const selectedItem: Item | null = useAppSelector((state: RootState) => state.app.selectedItem);
    const tooltipWidth = Math.max(item.size.width ? item.size.width : 0, 200);
    const tooltipHeight = Math.max(item.size.height ? item.size.height : 0, 200);
    const [tooltipLocation, setTooltipLocation] = React.useState({
        x: item.position.x + tooltipWidth,
        y: item.position.y + tooltipHeight / 2,
    });
    const [showTooltip, setShowTooltip] = React.useState(false);

    const handleImageSelect = () => {
        dispatch(setIsLibraryOpen(true));
    };

    const updateTooltipLocation = (node: Konva.Node) => {
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        setTooltipLocation({
            x: node.x() + node.width() * scaleX,
            y: node.y() + (node.height() * scaleY) / 2,
        });
    };

    const handleDuringTransform = (e: Konva.KonvaEventObject<Event>) => {
        transformItem(e, item);
        updateTooltipLocation(e.target);
    };

    const handleItemDrag = (e: Konva.KonvaEventObject<MouseEvent>) => {
        moveItem(e, item);
        updateTooltipLocation(e.target);
    };

    const parseTextWithColors = (lore: TooltipLine): React.ReactNode => {
        const text = lore.text;
        const fontSize = lore.fontSize ? lore.fontSize : 14;

        const minecraftColorRegex = /[§&][0-9a-f]/;
        const hexColorRegex = /#[0-9a-fA-F]{6}/g;

        const parts = text.split(/([§&][0-9a-f]|#[0-9a-fA-F]{6})/);
        const elements: React.ReactNode[] = [];
        let currentColor = '#FFFFFF';

        parts.forEach((part, index) => {
            if (minecraftColorRegex.test(part)) {
                currentColor = minecraftColorMap[part];
            } else if (hexColorRegex.test(part)) {
                currentColor = part;
            } else if (part) {
                elements.push(
                    <span
                        key={index}
                        style={{
                            color: currentColor,
                            fontSize: fontSize,
                            height: fontSize,
                            textDecorationLine: lore.fontDecoration ? lore.fontDecoration : 'none',
                            textDecorationStyle: 'solid',
                            textDecorationColor: currentColor,
                        }}
                    >
                        {part}
                    </span>,
                );
            }
        });

        return (
            <div
                style={{
                    justifyContent:
                        lore.textAlign === 'center' ? 'center' : lore.textAlign === 'right' ? 'flex-end' : 'flex-start',
                    fontFamily: lore.fontFamily ? lore.fontFamily : 'Arial',
                    fontStyle: lore.fontEffect ? lore.fontEffect : 'normal',
                    width: '100%',
                    height: lore.fontSize ? lore.fontSize : 14,
                    lineHeight: `${lore.fontSize ? lore.fontSize : 14}px`,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                {elements}
            </div>
        );
    };

    const handleTooltipDisplayName = () => {
        if (item.displayName) {
            return (
                <div
                    className='tooltip-display-name-text'
                    style={{
                        width: tooltipWidth,
                        height: item.displayName.fontSize + 1,
                    }}
                >
                    {parseTextWithColors(item.displayName)}
                </div>
            );
        } else if (item.entity) {
            let entityName = item.entity;
            entityName = entityName
                .split('_')
                .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                .join(' ');
            return (
                <div
                    className='tooltip-display-name-text'
                    style={{
                        width: tooltipWidth,
                        height: 15,
                    }}
                >
                    {entityName}
                </div>
            );
        }
        return null;
    };

    const handleTooltipLore = () => {
        if (item.lore) {
            return item.lore.map((lore, index) => (
                <div
                    key={index}
                    className='tooltip-lore-text'
                    style={{
                        width: tooltipWidth,
                        height: lore.fontSize + 1,
                    }}
                >
                    {parseTextWithColors(lore)}
                </div>
            ));
        }
        return null;
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
                    stroke={item.isStokeEnabled && item.strokeColor ? item.strokeColor : 'transparent'}
                    strokeWidth={item.isStokeEnabled && item.strokeWidth ? item.strokeWidth : 1}
                    dashEnabled={item.strokeStyle !== 'solid'}
                    dash={item.strokeStyle === 'dashed' ? [15, 15] : [5, 5]}
                    image={image}
                    onDragMove={handleItemDrag}
                    onTransform={handleDuringTransform}
                    onClick={(e) => selectItem(e, item)}
                    onTransformStart={() => transformItemStart(item)}
                    onTransformEnd={() => transformItemEnd(item)}
                    onDragStart={() => moveItemStart(item)}
                    onDragEnd={() => moveItemEnd(item)}
                    onMouseOver={() => setShowTooltip(true)}
                    onMouseOut={() => setShowTooltip(false)}
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
                    onDragMove={handleItemDrag}
                    onTransform={handleDuringTransform}
                    onClick={(e) => selectItem(e, item)}
                    onDblClick={(e) => handleImageSelect()}
                    onTransformStart={() => transformItemStart(item)}
                    onTransformEnd={() => transformItemEnd(item)}
                    onDragStart={() => moveItemStart(item)}
                    onDragEnd={() => moveItemEnd(item)}
                    draggable={selectedItem?.id === item.id}
                />
            )}
            {(item.showTooltip ?? showTooltip) && item.tooltipSettings && tooltipLocation.x && (
                <Html
                    groupProps={{ offsetX: -tooltipLocation.x, offsetY: -tooltipLocation.y }}
                    divProps={{ className: 'd-flex tooltip-box', style: {} }}
                >
                    <div
                        style={{
                            borderRadius: '5px',
                            borderColor: item.tooltipSettings.tooltip.isStokeEnabled
                                ? item.tooltipSettings.tooltip.strokeColor
                                : 'transparent',
                            borderStyle: item.tooltipSettings.tooltip.strokeStyle,
                            borderWidth: item.tooltipSettings.tooltip.strokeWidth,
                            backgroundColor: item.tooltipSettings.tooltip.isFillEnabled
                                ? item.tooltipSettings.tooltip.fillColor
                                : 'transparent',
                            padding: 2,
                        }}
                    >
                        {handleTooltipDisplayName()}
                        {handleTooltipLore()}
                    </div>
                </Html>
            )}
        </Group>
    );
};

export default CraftiCustom;
