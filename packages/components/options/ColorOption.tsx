import { type Item } from '~/types/item';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import { debounce } from 'lodash';
import { useItem } from '~/hooks/useItem';
import { getColorType, hexToRgba, rgbaToHex } from '~/utils/color';

interface ColorOptionProps {
    item: Item;
    type: 'fill' | 'stroke';
}

const ColorOption: React.FC<ColorOptionProps> = ({ item, type }) => {
    const { updateItem } = useItem();
    const [color, setColor] = useState<string>('#000000');
    const [opacity, setOpacity] = useState<number>(1);
    const isLocalUpdate = useRef(false);

    const isEnabled = type === 'fill' ? item.isFillEnabled : item.isStrokeEnabled;
    const isAllowed = type === 'fill' ? item.isFillable : item.isStrokeable;
    const currentColor = type === 'fill' ? item.fillColor : item.strokeColor;
    const currentOpacity = type === 'fill' ? item.fillOpacity : item.strokeOpacity;
    const label = type === 'fill' ? 'Fill' : 'Stroke';

    useEffect(() => {
        if (!isLocalUpdate.current && currentColor) {
            const colorType = getColorType(currentColor);
            if (colorType === 'hex') {
                setColor(currentColor);
                setOpacity(currentOpacity ?? 1);
            } else if (colorType === 'rgba') {
                const { color: hexColor, opacity: newOpacity } = rgbaToHex(currentColor);
                setColor(hexColor);
                setOpacity(newOpacity);
            }
        }
        isLocalUpdate.current = false;
    }, [currentColor, currentOpacity]);

    const debouncedUpdate = useCallback(
        debounce((newColor: string, newOpacity: number) => {
            const rgbaColor = hexToRgba(newColor, newOpacity);
            const updateObj = type === 'fill' ? { fillColor: rgbaColor } : { strokeColor: rgbaColor };
            updateItem({ ...item, ...updateObj }, item);
        }, 300),
        [item, updateItem, type],
    );

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setColor(newColor);
        isLocalUpdate.current = true;
        debouncedUpdate(newColor, opacity);
    };

    const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newOpacity = Number(e.target.value) / 100;
        setOpacity(newOpacity);
        isLocalUpdate.current = true;
        debouncedUpdate(color, newOpacity);
    };

    if (!isAllowed || !isEnabled) {
        return null;
    }

    return (
        <>
            <Form.Label>{label} Color</Form.Label>
            <Form.Control
                type='color'
                value={color}
                onChange={handleColorChange}
                className='mb-2'
                style={{
                    opacity: opacity,
                    backgroundColor: color,
                    border: '1px solid var(--bs-border-color)',
                }}
            />
            <Form.Label className='mb-1'>{label} Opacity</Form.Label>
            <div className='d-flex gap-2 align-items-center'>
                <Form.Range
                    className='flex-grow-1'
                    min={0}
                    max={100}
                    value={opacity * 100}
                    onChange={handleOpacityChange}
                />
                <Form.Control
                    type='number'
                    min={0}
                    max={100}
                    size='sm'
                    style={{ width: '70px' }}
                    value={Math.round(opacity * 100)}
                    disabled
                />
            </div>
        </>
    );
};

export default ColorOption;
