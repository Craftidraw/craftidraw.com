import { type Item } from '~/types/item';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import { debounce } from 'lodash';
import { useItem } from '~/hooks/useItem';

interface FillColorOptionProps {
    item: Item;
}

const FillColorOption: React.FC<FillColorOptionProps> = ({ item }) => {
    const { updateItem } = useItem();
    const [color, setColor] = useState<string>('rgb(0, 0, 0, 0)');
    const [opacity, setOpacity] = useState<number>(1);
    const isLocalUpdate = useRef(false);

    useEffect(() => {
        if (!isLocalUpdate.current) {
            let rgba;
            if (item.fillColor) rgba = rgbToHex(item.fillColor);
            if (rgba) {
                setColor(rgba.color);
                setOpacity(rgba.opacity);
            }
        }
        isLocalUpdate.current = false;
    }, [color, item, opacity]);

    const debounceColorChange = useCallback(
        debounce((item: Item, color: string, opacity: number) => {
            updateItem({ ...item, fillColor: hexToRgbA(color, opacity) }, item);
        }, 500),
        [],
    );

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newColor = e.target.value;
        setColor(newColor);
        isLocalUpdate.current = true;
        debounceColorChange(item, newColor, opacity);
    };

    const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = Number(e.target.value);
        const newOpacity = value / 100;
        setOpacity(newOpacity);
        isLocalUpdate.current = true;
        debounceColorChange(item, color, newOpacity);
    };

    const hexToRgbA = (hex: string, opacity: number) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity})`
            : '';
    };

    const rgbToHex = (color: string) => {
        const result = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/.exec(color);
        if (result) {
            const r = parseInt(result[1]);
            const g = parseInt(result[2]);
            const b = parseInt(result[3]);
            const a = result[4] ? parseFloat(result[4]) : 1;
            return { color: '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1), opacity: a };
        }
        return { color: '#000000', opacity: 1 };
    };

    return (
        <>
            {item.isFillable && item.isFillEnabled && (
                <>
                    <Form.Label style={{ marginBottom: '0' }}>Fill Color</Form.Label>
                    <div style={{ margin: '0.45rem 0', border: '1px solid rgb(0, 0, 0, 0.1)', borderRadius: '8px' }}>
                        <Form.Control
                            type='color'
                            value={color}
                            onChange={(e) => handleColorChange(e)}
                            style={{ opacity: opacity, border: 'none', borderRadius: '0' }}
                        />
                    </div>
                    <Form.Label style={{ marginBottom: '0' }}>Fill Color Opacity</Form.Label>
                    <div className='d-flex flex-row'>
                        <div className='col-9 align-self-center' style={{ paddingRight: '10px' }}>
                            <Form.Range
                                min={0}
                                max={100}
                                value={opacity * 100}
                                onChange={(e) => handleOpacityChange(e)}
                            />
                        </div>
                        <div className='col-3'>
                            <Form.Control type='number' min={0} max={1} size='sm' value={opacity} disabled={true} />
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default FillColorOption;
