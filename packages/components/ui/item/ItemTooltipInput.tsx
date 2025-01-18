import { Button, Form } from 'react-bootstrap';
import React, { useCallback, useState } from 'react';
import { useItem } from '~/hooks/useItem';
import { debounce } from 'lodash';
import type { CustomItem, TooltipLine } from '~/types/item';
import PopoverPortal from '~/components/common/PopoverPortal';

interface ItemTooltipInputProps {
    item: CustomItem;
    index: number;
    type: 'display' | 'lore';
}

const ItemTooltipInput: React.FC<ItemTooltipInputProps> = ({ item, index, type }) => {
    const { updateItem } = useItem();

    const [alteredText, setAlteredText] = useState<string>(
        type === 'display' ? (item.displayName?.text ?? '') : (item.lore?.[index]?.text ?? ''),
    );
    const [showPopover, setShowPopover] = useState(false);
    const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);

    const debounceDisplayNameChange = useCallback(
        debounce((item: CustomItem, text: string) => {
            const newDisplayName = {
                ...(item.displayName ?? {}),
                text: text,
            };
            const newItem = { ...item, displayName: newDisplayName };
            updateItem(newItem, item);
        }, 500),
        [],
    );

    const debounceLoreChange = useCallback(
        debounce((item: CustomItem, index: number, text: string) => {
            const newLore = [...(item.lore ?? [])];
            newLore[index] = { ...newLore[index], text: text } as TooltipLine;
            const newItem = { ...item, lore: newLore };
            updateItem(newItem, item);
        }, 500),
        [],
    );

    const handleLoreChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        item: CustomItem,
        index: number,
    ) => {
        setAlteredText(e.target.value);
        debounceLoreChange(item, index, e.target.value);
    };

    const handleDisplayNameChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        item: CustomItem,
    ) => {
        setAlteredText(e.target.value);
        debounceDisplayNameChange(item, e.target.value);
    };

    const handleLoreRemove = (item: CustomItem, index: number) => {
        const newLore = [...(item.lore ?? [])];
        newLore.splice(index, 1);
        const newItem = { ...item, lore: newLore };
        updateItem(newItem, item);
    };

    const handleTextAlign = (
        item: CustomItem,
        index: number,
        textAlign: 'left' | 'center' | 'right',
        type: 'display' | 'lore',
    ) => {
        if (type === 'display') {
            const newDisplayName = { ...(item.displayName ?? {}) };
            newDisplayName.textAlign = textAlign;
            const newItem = { ...item, displayName: newDisplayName };
            updateItem(newItem);
        } else if (type === 'lore') {
            const newLore = [...(item.lore ?? [])];
            newLore[index] = { ...newLore[index], textAlign: textAlign } as TooltipLine;
            const newItem = { ...item, lore: newLore };
            updateItem(newItem, item);
        }
    };

    const handleFontSize = (item: CustomItem, index: number, fontSize: number, type: 'display' | 'lore') => {
        if (type === 'display') {
            const newDisplayName = { ...(item.displayName ?? {}) };
            newDisplayName.fontSize = fontSize;
            const newItem = { ...item, displayName: newDisplayName };
            updateItem(newItem);
        } else if (type === 'lore') {
            const newLore = [...(item.lore ?? [])];
            newLore[index] = { ...newLore[index], fontSize: fontSize } as TooltipLine;
            const newItem = { ...item, lore: newLore };
            updateItem(newItem, item);
        }
    };

    const handleFontFamily = (item: CustomItem, index: number, fontFamily: string, type: 'display' | 'lore') => {
        if (type === 'display') {
            const newDisplayName = { ...(item.displayName ?? {}) };
            newDisplayName.fontFamily = fontFamily;
            const newItem = { ...item, displayName: newDisplayName };
            updateItem(newItem);
        } else if (type === 'lore') {
            const newLore = [...(item.lore ?? [])];
            newLore[index] = { ...newLore[index], fontFamily: fontFamily } as TooltipLine;
            const newItem = { ...item, lore: newLore };
            updateItem(newItem, item);
        }
    };

    const handleFontDecoration = (
        item: CustomItem,
        index: number,
        fontDecoration: 'line-through' | 'underline' | 'none',
        type: 'display' | 'lore',
    ) => {
        if (type === 'display') {
            const newDisplayName = { ...(item.displayName ?? {}) };
            newDisplayName.fontDecoration = fontDecoration;
            const newItem = { ...item, displayName: newDisplayName };
            updateItem(newItem);
        } else if (type === 'lore') {
            const newLore = [...(item.lore ?? [])];
            newLore[index] = { ...newLore[index], fontDecoration: fontDecoration } as TooltipLine;
            const newItem = { ...item, lore: newLore };
            updateItem(newItem, item);
        }
    };

    const handleFontEffect = (
        item: CustomItem,
        index: number,
        fontEffect: 'normal' | 'bold' | 'italic',
        type: 'display' | 'lore',
    ) => {
        let effects: string[] = [];
        const tooltipLine: TooltipLine | undefined = type === 'display' ? item.displayName : (item.lore ?? [])[index];
        if (tooltipLine === undefined) return;

        if (tooltipLine.fontEffect !== undefined) {
            effects = tooltipLine.fontEffect?.split(' ') ?? [];
        }

        if (fontEffect === 'normal') {
            effects = ['normal'];
        } else if (fontEffect === 'italic' || fontEffect === 'bold') {
            if (effects.includes('normal')) {
                effects = [];
            }
            if (effects.includes(fontEffect)) {
                effects = effects.filter((e) => e !== fontEffect);
            } else {
                effects.push(fontEffect);
            }
        }
        if (effects.length === 0) effects = ['normal'];

        if (type === 'display') {
            const newDisplayName = { ...(item.displayName ?? {}) };
            newDisplayName.fontEffect = effects.join(' ');
            const newItem = { ...item, displayName: newDisplayName };
            updateItem(newItem, item);
        } else if (type === 'lore') {
            const newLore = [...(item.lore ?? [])];
            newLore[index] = { ...newLore[index], fontEffect: effects.join(' ') } as TooltipLine;
            const newItem = { ...item, lore: newLore };
            updateItem(newItem, item);
        }
    };

    return (
        <>
            <Form.Control
                placeholder={`Line ${index + 1}`}
                value={alteredText}
                type='text'
                onChange={(e) => {
                    if (type === 'display') {
                        handleDisplayNameChange(e, item);
                    } else {
                        handleLoreChange(e, item, index);
                    }
                }}
            />
            <Button variant='secondary' ref={setButtonRef} onClick={() => setShowPopover(!showPopover)}>
                <i className='fa-solid fa-ellipsis'></i>
            </Button>
            <PopoverPortal show={showPopover} target={buttonRef} onHide={() => setShowPopover(false)}>
                <Form>
                    <Form.Group>
                        <Form.Label>Text Align</Form.Label>
                        <div>
                            <Button
                                variant='options'
                                active={
                                    type === 'display'
                                        ? item.displayName?.textAlign === 'left'
                                        : item.lore?.[index]?.textAlign === 'left'
                                }
                                onClick={() => {
                                    handleTextAlign(item, index, 'left', type);
                                }}
                            >
                                Left
                            </Button>
                            <Button
                                variant='options'
                                active={
                                    type === 'display'
                                        ? item.displayName?.textAlign === 'center'
                                        : item.lore?.[index]?.textAlign === 'center'
                                }
                                onClick={() => {
                                    handleTextAlign(item, index, 'center', type);
                                }}
                            >
                                Center
                            </Button>
                            <Button
                                variant='options'
                                active={
                                    type === 'display'
                                        ? item.displayName?.textAlign === 'right'
                                        : item.lore?.[index]?.textAlign === 'right'
                                }
                                onClick={() => {
                                    handleTextAlign(item, index, 'right', type);
                                }}
                            >
                                Right
                            </Button>
                        </div>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Font Size</Form.Label>
                        <div>
                            <Button
                                variant='options'
                                active={
                                    type === 'display'
                                        ? item.displayName?.fontSize === 12
                                        : item.lore?.[index]?.fontSize === 12
                                }
                                onClick={() => {
                                    handleFontSize(item, index, 12, type);
                                }}
                            >
                                12
                            </Button>
                            <Button
                                variant='options'
                                active={
                                    type === 'display'
                                        ? item.displayName?.fontSize === 14
                                        : item.lore?.[index]?.fontSize === 14
                                }
                                onClick={() => {
                                    handleFontSize(item, index, 14, type);
                                }}
                            >
                                14
                            </Button>
                            <Button
                                variant='options'
                                active={
                                    type === 'display'
                                        ? item.displayName?.fontSize === 16
                                        : item.lore?.[index]?.fontSize === 16
                                }
                                onClick={() => {
                                    handleFontSize(item, index, 16, type);
                                }}
                            >
                                16
                            </Button>
                            <Button
                                variant='options'
                                active={
                                    type === 'display'
                                        ? item.displayName?.fontSize === 18
                                        : item.lore?.[index]?.fontSize === 18
                                }
                                onClick={() => {
                                    handleFontSize(item, index, 18, type);
                                }}
                            >
                                18
                            </Button>
                        </div>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Font Family</Form.Label>
                        <div>
                            <Button
                                variant='options'
                                active={
                                    type === 'display'
                                        ? item.displayName?.fontFamily === 'Minecraft'
                                        : item.lore?.[index]?.fontFamily === 'Minecraft'
                                }
                                onClick={() => {
                                    handleFontFamily(item, index, 'Minecraft', type);
                                }}
                            >
                                Minecraft
                            </Button>
                            <Button
                                variant='options'
                                active={
                                    type === 'display'
                                        ? item.displayName?.fontFamily === 'Arial'
                                        : item.lore?.[index]?.fontFamily === 'Arial'
                                }
                                onClick={() => {
                                    handleFontFamily(item, index, 'Arial', type);
                                }}
                            >
                                Arial
                            </Button>
                        </div>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Font Decoration</Form.Label>
                        <div>
                            <Button
                                active={
                                    type === 'display'
                                        ? item.displayName?.fontDecoration === 'line-through'
                                        : item.lore?.[index]?.fontDecoration === 'line-through'
                                }
                                variant='options'
                                onClick={() => {
                                    handleFontDecoration(item, index, 'line-through', type);
                                }}
                            >
                                Strikethrough
                            </Button>
                            <Button
                                active={
                                    type === 'display'
                                        ? item.displayName?.fontDecoration === 'underline'
                                        : item.lore?.[index]?.fontDecoration === 'underline'
                                }
                                variant='options'
                                onClick={() => {
                                    handleFontDecoration(item, index, 'underline', type);
                                }}
                            >
                                Underline
                            </Button>
                            <Button
                                active={
                                    type === 'display'
                                        ? item.displayName?.fontDecoration === 'none'
                                        : item.lore?.[index]?.fontDecoration === 'none'
                                }
                                variant='options'
                                onClick={() => {
                                    handleFontDecoration(item, index, 'none', type);
                                }}
                            >
                                None
                            </Button>
                        </div>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Font Effect</Form.Label>
                        <div>
                            <Button
                                variant='options'
                                active={
                                    type === 'display'
                                        ? item.displayName?.fontEffect?.includes('bold')
                                        : item.lore?.[index]?.fontEffect?.includes('bold')
                                }
                                onClick={() => {
                                    handleFontEffect(item, index, 'bold', type);
                                }}
                            >
                                Bold
                            </Button>
                            <Button
                                variant='options'
                                active={
                                    type === 'display'
                                        ? item.displayName?.fontEffect?.includes('italic')
                                        : item.lore?.[index]?.fontEffect?.includes('italic')
                                }
                                onClick={() => {
                                    handleFontEffect(item, index, 'italic', type);
                                }}
                            >
                                Italic
                            </Button>
                            <Button
                                variant='options'
                                active={
                                    type === 'display'
                                        ? item.displayName?.fontEffect?.includes('normal')
                                        : item.lore?.[index]?.fontEffect?.includes('normal')
                                }
                                onClick={() => {
                                    handleFontEffect(item, index, 'normal', type);
                                }}
                            >
                                Normal
                            </Button>
                        </div>
                    </Form.Group>
                </Form>
            </PopoverPortal>
            {type === 'lore' && (
                <>
                    <Button variant='secondary' onClick={() => {}}>
                        <i className='fa-solid fa-up-down-left-right'></i>
                    </Button>
                    <Button variant='secondary' onClick={() => handleLoreRemove(item, index)}>
                        <i className='fa-solid fa-trash'></i>
                    </Button>
                </>
            )}
        </>
    );
};

export default ItemTooltipInput;
