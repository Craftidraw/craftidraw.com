import type { CustomItem, ImageItem, Item, LineItem, RectangleItem, TextItem } from '~/types/item';
import { useItem } from './useItem';

export const useOptions = () => {
    const { updateItem } = useItem();

    const setSize = (width: number, height: number) => {};

    const enableStroke = (item: Item) => {
        updateItem(
            {
                ...item,
                isStrokeEnabled: !item.isStrokeEnabled,
            },
            item,
        );
    };

    const enableFill = (item: Item) => {
        updateItem(
            {
                ...item,
                isFillEnabled: !item.isFillEnabled,
            },
            item,
        );
    };

    const setStrokeColor = (item: Item, color: string) => {
        updateItem(
            {
                ...item,
                strokeColor: color,
            },
            item,
        );
    };

    const setFillColor = (item: Item, color: string) => {
        updateItem(
            {
                ...item,
                fillColor: color,
            },
            item,
        );
    };

    const setStrokeStyle = (item: Item, style: string) => {
        updateItem(
            {
                ...item,
                strokeStyle: style,
            },
            item,
        );
    };

    const setStrokeWidth = (item: Item, width: number) => {
        updateItem(
            {
                ...item,
                strokeWidth: width,
            },
            item,
        );
    };

    const setBorderRadius = (item: Item, radius: number) => {
        if (item.type === 'rectangle') {
            updateItem(
                {
                    ...item,
                    borderRadius: radius,
                } as RectangleItem,
                item,
            );
        }
        if (item.type === 'image') {
            updateItem(
                {
                    ...item,
                    borderRadius: radius,
                } as ImageItem,
                item,
            );
        }
    };

    const setFontSize = (item: Item, size: number) => {
        if (item.type === 'text') {
            updateItem(
                {
                    ...item,
                    fontSize: size,
                } as TextItem,
                item,
            );
        }
    };

    const setFontEffect = (item: Item, effect: string) => {
        if (item.type !== 'text') return;

        let effects: string[] = [];
        if ((item as TextItem).fontEffect !== undefined) {
            effects = (item as TextItem).fontEffect?.split(' ') ?? [];
        }

        if (effect === 'clear' || effect === 'normal') {
            effects = ['normal'];
        } else if (effect === 'italic' || effect === 'bold') {
            if (effects.includes('normal')) {
                effects = [];
            }
            if (effects.includes(effect)) {
                effects = effects.filter((e) => e !== effect);
            } else {
                effects.push(effect);
            }
        }

        if (effects.length === 0) {
            effects = ['normal'];
        }

        updateItem(
            {
                ...item,
                fontEffect: effects.join(' '),
            } as TextItem,
            item,
        );
    };

    const setFontDecoration = (item: Item, decoration: string) => {
        if (item.type !== 'text') return;

        if (decoration === 'none') {
            updateItem(
                {
                    ...item,
                    fontDecoration: 'none',
                } as TextItem,
                item,
            );
            return;
        }

        if (decoration === 'underline') {
            if ((item as TextItem).fontDecoration === 'underline') {
                updateItem(
                    {
                        ...item,
                        fontDecoration: 'none',
                    } as TextItem,
                    item,
                );
            } else {
                updateItem(
                    {
                        ...item,
                        fontDecoration: 'underline',
                    } as TextItem,
                    item,
                );
            }
            return;
        }

        if (decoration === 'line-through') {
            if ((item as TextItem).fontDecoration === 'line-through') {
                updateItem(
                    {
                        ...item,
                        fontDecoration: 'none',
                    } as TextItem,
                    item,
                );
            } else {
                updateItem(
                    {
                        ...item,
                        fontDecoration: 'line-through',
                    } as TextItem,
                    item,
                );
            }
            return;
        }
    };

    const setTextAlign = (item: Item, align: string) => {
        if (item.type === 'text') {
            updateItem(
                {
                    ...item,
                    textAlign: align,
                } as TextItem,
                item,
            );
        }
    };

    const setFontFamily = (item: Item, fontFamily: string) => {
        if (item.type === 'text') {
            updateItem(
                {
                    ...item,
                    fontFamily: fontFamily,
                } as TextItem,
                item,
            );
        }
    };

    const toggleArrowHead = (item: Item, face: 'head' | 'tail' | 'none') => {
        if (item.type === 'line') {
            const lineItem = item as LineItem;

            let newArrowHeadState = lineItem.hasArrowHead;
            let newArrowTailState = lineItem.hasArrowTail;

            if (face === 'head') {
                newArrowHeadState = !lineItem.hasArrowHead;
            } else if (face === 'tail') {
                newArrowTailState = !lineItem.hasArrowTail;
            } else if (face === 'none') {
                newArrowHeadState = false;
                newArrowTailState = false;
            }

            updateItem(
                {
                    ...lineItem,
                    isArrow: newArrowHeadState ?? newArrowTailState,
                    isFillEnabled: newArrowHeadState ?? newArrowTailState,
                    hasArrowHead: newArrowHeadState,
                    hasArrowTail: newArrowTailState,
                } as LineItem,
                item,
            );
        }
    };

    const setText = (item: Item, text: string) => {
        if (item.type === 'text') {
            updateItem(
                {
                    ...item,
                    text: text,
                } as TextItem,
                item,
            );
        }
    };

    const toggleTooltip = (item: Item) => {
        if (item.type === 'custom') {
            updateItem(
                {
                    ...item,
                    showTooltip: !(item as CustomItem).showTooltip,
                } as CustomItem,
                item,
            );
        }
    };

    return {
        enableStroke,
        enableFill,
        setStrokeColor,
        setFillColor,
        setStrokeStyle,
        setStrokeWidth,
        setBorderRadius,
        setFontSize,
        setFontEffect,
        setFontDecoration,
        setTextAlign,
        setFontFamily,
        toggleArrowHead,
        setText,
        toggleTooltip,
    };
};
