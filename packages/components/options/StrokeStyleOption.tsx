import { useOptions } from '~/hooks/useOptions';
import type { Item } from '~/types/item';
import { Button, Form } from 'react-bootstrap';
import React from 'react';

interface StrokeStyleOptionProps {
    item: Item;
}

const StrokeStyleOption: React.FC<StrokeStyleOptionProps> = ({ item }) => {
    const { setStrokeStyle } = useOptions();

    return (
        <>
            {item.isStrokeable && (
                <div className='d-flex flex-column'>
                    <Form.Label>Stroke Style</Form.Label>
                    <div>
                        <Button
                            variant='options'
                            active={item.strokeStyle === 'solid'}
                            onClick={(e) => setStrokeStyle(item, 'solid')}
                        >
                            Solid
                        </Button>
                        <Button
                            variant='options'
                            active={item.strokeStyle === 'dashed'}
                            onClick={(e) => setStrokeStyle(item, 'dashed')}
                        >
                            Dashed
                        </Button>
                        <Button
                            variant='options'
                            active={item.strokeStyle === 'dotted'}
                            onClick={(e) => setStrokeStyle(item, 'dotted')}
                        >
                            Dotted
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default StrokeStyleOption;
