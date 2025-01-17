'use client';

import React, { useCallback, useEffect, useState } from 'react';
import type { RootState } from '~/lib/store/store';
import type { CustomItem, Item } from '~/types/item';
import { Button, Form, InputGroup } from 'react-bootstrap';
import StrokeOption from '../options/StrokeOption';
import StrokeColorOption from '../options/StrokeColorOption';
import FillOption from '../options/FillOption';
import FillColorOption from '../options/FillColorOption';
import StrokeWidthOption from '../options/StrokeWidthOption';
import StrokeStyleOption from '../options/StrokeStyleOption';
import BorderCurveOption from '../options/BorderCurveOption';
import FontSizeOption from '../options/FontSizeOption';
import FontFamilyOption from '../options/FontFamilyOption';
import FontEffectOption from '../options/FontEffectOption';
import TextAlignOption from '../options/TextAlignOption';
import ArrowHeadOption from '../options/ArrowHeadOption';
import ImageOption from '../options/ImageOption';
import TextOption from '../options/TextOption';
import FontDecorationOption from '../options/FontDecorationOption';
import { useItem } from '~/hooks/useItem';
import ToggleTooltipOption from '../options/ToggleTooltipOption';
import ItemTooltipInput from './item/ItemTooltipInput';
import { debounce } from 'lodash';
import { selectItemById, setIsCustomTooltipsOpen } from '~/lib/store/features/appSlice';
import Image from 'next/image';
import InputGroupWrapper from '~/components/common/InputGroupWrapper';
import { useAppDispatch, useAppSelector } from '~/lib/store/hooks';

const OptionsBar = () => {
    const dispatch = useAppDispatch();
    const { updateItem } = useItem();

    const selectedItem: Item | null = useAppSelector((state: RootState) => state.app.selectedItem);
    const currentItem = useAppSelector((state: RootState) => selectItemById(state, selectedItem?.id ?? ''));

    const [alteredEntityText, setAlteredEntityText] = useState<string>(
        selectedItem?.type === 'custom' ? (selectedItem as CustomItem).entity : '',
    );

    const debounceEntityChange = useCallback(
        debounce((item: Item, text: string) => {
            const newItem = { ...item, entity: text } as CustomItem;
            updateItem(newItem, item);
        }, 500),
        [],
    );

    const handleLoreAdd = (item: Item) => {
        if (item.type !== 'custom') return;
        const newItem = {
            ...item,
            lore: [
                ...((item as CustomItem).lore ?? []),
                {
                    text: '',
                    textAlign: 'left',
                    fontSize: 14,
                    fontFamily: 'Arial',
                },
            ],
        };
        updateItem(newItem, item);
    };

    const handleLoreFields = (item: Item) => {
        if (!selectedItem) return;
        if (selectedItem.type !== 'custom') return;

        return (item as CustomItem).lore?.map((line, index) => (
            <InputGroup size='sm' key={'lore-input-' + index}>
                <ItemTooltipInput key={'lore-input-' + index} item={item as CustomItem} type='lore' index={index} />
            </InputGroup>
        ));
    };

    return (
        <>
            {currentItem && (
                <>
                    {currentItem.type === 'custom' && (
                        <Form className='options-bar-container'>
                            <div className='d-flex'>
                                <Form.Label>Custom Item</Form.Label>
                                {(currentItem as CustomItem)?.image && (
                                    <div
                                        className='ms-auto'
                                        style={{
                                            backgroundColor: 'rgb(243, 243, 243)',
                                            padding: '8px',
                                            borderRadius: '8px',
                                        }}
                                    >
                                        <Image
                                            src={(currentItem as CustomItem)?.image?.data ?? ''}
                                            alt='Item'
                                            width={26}
                                            height={26}
                                        />
                                    </div>
                                )}
                            </div>
                            <hr className='options-hr' />
                            <Form.Group className='d-flex flex-column'>
                                <ToggleTooltipOption item={currentItem} />
                                <div className='d-flex flex-column'>
                                    <Form.Label>Tooltip</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type='text'
                                            size='sm'
                                            value={(currentItem as CustomItem).tooltip?.config?.name ?? 'Not set'}
                                            disabled={true}
                                        />
                                        <Button
                                            variant='secondary'
                                            onClick={() => {
                                                dispatch(setIsCustomTooltipsOpen(true));
                                            }}
                                        >
                                            Browse
                                        </Button>
                                    </InputGroup>
                                </div>
                                <div>
                                    <div className='d-flex flex-column'>
                                        <Form.Label>Entity</Form.Label>
                                        <Form.Control
                                            type='text'
                                            size='sm'
                                            placeholder='Entity'
                                            value={alteredEntityText}
                                            onChange={(e) => {
                                                setAlteredEntityText(e.target.value);
                                                debounceEntityChange(currentItem, e.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className='d-flex flex-column'>
                                    <Form.Label>Display Name</Form.Label>
                                    <InputGroup size='sm'>
                                        <ItemTooltipInput
                                            key={'display-input'}
                                            item={currentItem as CustomItem}
                                            index={0}
                                            type='display'
                                        />
                                    </InputGroup>
                                </div>
                                <div className='d-flex flex-column'>
                                    <div className='d-flex'>
                                        <Form.Label>Lore</Form.Label>
                                        <Button
                                            className='ms-auto my-2'
                                            variant='primary'
                                            onClick={() => handleLoreAdd(currentItem)}
                                        >
                                            Add Line
                                        </Button>
                                    </div>
                                    <InputGroupWrapper>
                                        {handleLoreFields(currentItem)?.length ? (
                                            handleLoreFields(currentItem)
                                        ) : (
                                            <p className='text-muted my-1'>No lore found.</p>
                                        )}
                                    </InputGroupWrapper>
                                </div>
                                <ImageOption item={currentItem} />
                            </Form.Group>
                        </Form>
                    )}
                    {currentItem.type !== 'custom' && (
                        <Form className='options-bar-container d-flex flex-column'>
                            <Form.Label>
                                {currentItem.type.charAt(0).toUpperCase() + currentItem.type.slice(1)}
                            </Form.Label>
                            <hr className='options-hr' />
                            <Form.Group className='d-flex flex-column'>
                                <StrokeOption item={currentItem} />
                                <FillOption item={currentItem} />
                                <StrokeColorOption item={currentItem} />
                                <FillColorOption item={currentItem} />
                                <TextOption item={currentItem} />
                                <StrokeStyleOption item={currentItem} />
                                <StrokeWidthOption item={currentItem} />
                                <BorderCurveOption item={currentItem} />
                                <FontSizeOption item={currentItem} />
                                <FontFamilyOption item={currentItem} />
                                <FontEffectOption item={currentItem} />
                                <FontDecorationOption item={currentItem} />
                                <TextAlignOption item={currentItem} />
                                <ArrowHeadOption item={currentItem} />
                                <ImageOption item={currentItem} />
                            </Form.Group>
                        </Form>
                    )}
                </>
            )}
        </>
    );
};

export default OptionsBar;
