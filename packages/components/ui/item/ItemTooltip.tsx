import { type TooltipLine, type CustomItem } from '~/types/item';
import { Text, Group, Rect } from 'react-konva';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useStage } from '~/providers/StageProvider';
import Konva from 'konva';
import { useItem } from '~/hooks/useItem';
import { useAppSelector } from '~/lib/store/hooks';
import { useMath } from '~/hooks/useMath';
import AnimatedConnector from './AnimatedConnector';

interface ItemTooltipProps {
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

const PADDING = {
    horizontal: 10,
    vertical: 8,
    lineSpacing: 2,
};

const ItemTooltip = ({ item }: ItemTooltipProps) => {
    const { stageRef } = useStage();
    const { updateItem } = useItem();
    const { getRectConnectorPoints } = useMath();

    const [itemPosition, setItemPosition] = useState(item.position);
    const [tooltipDragOffset, setTooltipDragOffset] = useState({ x: 0, y: 0 });
    const selectedItem = useAppSelector((state) => state.app.selectedItem);
    const stageItem = stageRef.current?.findOne((node: Konva.Node) => node.id() === item.id);

    useEffect(() => {
        if (!stageItem) return;

        const onDragMove = () => {
            setItemPosition(stageItem.position());
        };

        stageItem.on('dragmove', onDragMove);
        return () => {
            stageItem.off('dragmove', onDragMove);
        };
    }, [stageItem]);

    const baseTooltipPosition = useMemo(() => {
        return {
            x: itemPosition.x + item.size.width + item.tooltip.position.x,
            y: itemPosition.y + item.tooltip.position.y,
        };
    }, [itemPosition, item]);

    const tooltipPosition = useMemo(() => {
        return {
            x: baseTooltipPosition.x + tooltipDragOffset.x,
            y: baseTooltipPosition.y + tooltipDragOffset.y,
        };
    }, [baseTooltipPosition, tooltipDragOffset]);

    const connectionPoints = useMemo(() => {
        if (!selectedItem || selectedItem !== item.id) return null;

        const itemRect = {
            x: itemPosition.x,
            y: itemPosition.y,
            width: item.size.width,
            height: item.size.height,
        };

        const tooltipRect = {
            x: tooltipPosition.x,
            y: tooltipPosition.y,
            width: item.tooltip.size.width,
            height: item.tooltip.size.height,
        };

        const itemPoint = getRectConnectorPoints(itemRect, {
            x: tooltipRect.x + tooltipRect.width / 2,
            y: tooltipRect.y + tooltipRect.height / 2,
        });

        const tooltipPoint = getRectConnectorPoints(tooltipRect, {
            x: itemRect.x + itemRect.width / 2,
            y: itemRect.y + itemRect.height / 2,
        });

        return {
            itemPoint: itemPoint as [number, number],
            tooltipPoint: tooltipPoint as [number, number],
        };
    }, [itemPosition, tooltipPosition, item, selectedItem, getRectConnectorPoints]);

    const onTooltipDragStart = useCallback(
        (e: Konva.KonvaEventObject<DragEvent>) => {
            const tooltipNode = e.target;
            setTooltipDragOffset({ x: 0, y: 0 });

            const initialPos = {
                x: tooltipNode.x() - baseTooltipPosition.x,
                y: tooltipNode.y() - baseTooltipPosition.y,
            };
            tooltipNode.setAttr('initialPos', initialPos);
        },
        [baseTooltipPosition],
    );

    const onTooltipDragMove = useCallback(
        (e: Konva.KonvaEventObject<DragEvent>) => {
            const tooltipNode = e.target;
            const initialPos = tooltipNode.getAttr('initialPos') as { x: number; y: number };

            setTooltipDragOffset({
                x: tooltipNode.x() - baseTooltipPosition.x - initialPos.x,
                y: tooltipNode.y() - baseTooltipPosition.y - initialPos.y,
            });
        },
        [baseTooltipPosition],
    );

    const onTooltipDragEnd = useCallback(() => {
        const newRelativePosition = {
            x: tooltipPosition.x - itemPosition.x - item.size.width,
            y: tooltipPosition.y - itemPosition.y,
        };

        const updatedItem = {
            ...item,
            tooltip: {
                ...item.tooltip,
                position: newRelativePosition,
            },
        } as CustomItem;

        updateItem(updatedItem, item);
        setTooltipDragOffset({ x: 0, y: 0 });
    }, [tooltipPosition, itemPosition, item, updateItem]);

    const onTooltipTransform = useCallback((e: Konva.KonvaEventObject<Event>) => {
        const tooltipNode = e.target;
        const scaleX = tooltipNode.scaleX();
        const scaleY = tooltipNode.scaleY();
        tooltipNode.scaleX(1);
        tooltipNode.scaleY(1);

        const width = Math.max(5, tooltipNode.width() * scaleX);
        const height = Math.max(5, tooltipNode.height() * scaleY);

        tooltipNode.width(width);
        tooltipNode.height(height);
    }, []);

    const onTooltipTransformEnd = useCallback(
        (e: Konva.KonvaEventObject<Event>) => {
            const tooltipNode = e.target;
            const updatedItem = {
                ...item,
                tooltip: {
                    ...item.tooltip,
                    size: {
                        width: tooltipNode.width(),
                        height: tooltipNode.height(),
                    },
                },
            } as CustomItem;
            updateItem(updatedItem, item);
        },
        [item, updateItem],
    );

    const getTextWidth = (text: string, fontSize: number, fontFamily: string, fontStyle?: string) => {
        const tempText = new Konva.Text({
            text,
            fontSize,
            fontFamily,
            fontStyle,
        });
        return tempText.width();
    };

    const parseTextWithColors = (
        line: TooltipLine,
        tooltipWidth: number,
    ): Array<{ text: string; color: string; x: number }> => {
        const colorCodes = line.text.match(/(?:[§&][0-9a-f]|#[0-9a-fA-F]{6})/g) ?? [];
        const textParts = line.text.split(/[§&][0-9a-f]|#[0-9a-fA-F]{6}/);
        const result: Array<{ text: string; color: string; x: number }> = [];
        let currentColor = '#FFFFFF';
        let currentX = 0;

        const totalWidth = textParts.reduce(
            (acc, text) => acc + getTextWidth(text, line.fontSize || 14, line.fontFamily ?? 'Arial', line.fontEffect),
            0,
        );

        if (line.textAlign === 'center') {
            currentX = (tooltipWidth - totalWidth) / 2;
        } else if (line.textAlign === 'right') {
            currentX = tooltipWidth - totalWidth - PADDING.horizontal;
        } else {
            currentX = PADDING.horizontal;
        }

        textParts.forEach((text, index) => {
            if (text) {
                const textWidth = getTextWidth(text, line.fontSize || 14, line.fontFamily ?? 'Arial', line.fontEffect);
                result.push({
                    text,
                    color: currentColor,
                    x: currentX,
                });
                currentX += textWidth;
            }
            if (colorCodes[index]) {
                const colorCode = colorCodes[index];
                if (colorCode.startsWith('#')) {
                    currentColor = colorCode;
                } else {
                    currentColor = minecraftColorMap[colorCode] ?? '#FFFFFF';
                }
            }
        });

        return result;
    };

    const renderDisplayName = () => {
        if (!item.displayName) return null;

        const textParts = parseTextWithColors(item.displayName, item.tooltip.size.width);
        const fontSize = item.displayName.fontSize || 14;

        return textParts.map((part, index) => (
            <Text
                key={`name-${index}`}
                text={part.text}
                x={tooltipPosition.x + part.x}
                y={tooltipPosition.y + PADDING.vertical}
                fontSize={fontSize}
                fill={part.color}
                fontStyle={item.displayName?.fontEffect}
                fontFamily={item.displayName?.fontFamily ?? 'Arial'}
                textDecoration={item.displayName?.fontDecoration ?? ''}
                width={item.tooltip.size.width}
            />
        ));
    };

    const renderLore = () => {
        if (!item.lore) return null;

        return item.lore.map((line, lineIndex) => {
            const textParts = parseTextWithColors(line, item.tooltip.size.width);
            const fontSize = line.fontSize || 14;
            const yOffset = (lineIndex + 1) * (fontSize + PADDING.lineSpacing) + PADDING.vertical;

            return textParts.map((part, partIndex) => (
                <Text
                    key={`lore-${lineIndex}-${partIndex}`}
                    text={part.text}
                    x={tooltipPosition.x + part.x}
                    y={tooltipPosition.y + yOffset}
                    fontSize={fontSize}
                    fill={part.color}
                    fontStyle={line.fontEffect}
                    fontFamily={line.fontFamily ?? 'Arial'}
                    textDecoration={line.fontDecoration ?? ''}
                    width={item.tooltip.size.width}
                />
            ));
        });
    };

    return (
        <Group>
            {connectionPoints && (
                <AnimatedConnector
                    points={[
                        connectionPoints.tooltipPoint[0],
                        connectionPoints.tooltipPoint[1],
                        connectionPoints.itemPoint[0],
                        connectionPoints.itemPoint[1],
                    ]}
                />
            )}
            <Rect
                id={`tooltip-${item.id}`}
                x={tooltipPosition.x}
                y={tooltipPosition.y}
                width={item.tooltip.size.width}
                height={item.tooltip.size.height}
                fill={
                    item.tooltip.config?.settings.isFillEnabled
                        ? item.tooltip.config?.settings.fillColor
                        : 'transparent'
                }
                stroke={
                    item.tooltip.config?.settings.isStokeEnabled
                        ? item.tooltip.config?.settings.strokeColor
                        : 'transparent'
                }
                strokeWidth={item.tooltip.config?.settings.strokeWidth ?? 1}
                cornerRadius={item.tooltip.config?.settings.borderRadius ?? 5}
                draggable={selectedItem === item.id}
                onDragStart={onTooltipDragStart}
                onDragMove={onTooltipDragMove}
                onDragEnd={onTooltipDragEnd}
                onTransform={onTooltipTransform}
                onTransformEnd={onTooltipTransformEnd}
            />
            {renderDisplayName()}
            {renderLore()}
        </Group>
    );
};

export default ItemTooltip;
