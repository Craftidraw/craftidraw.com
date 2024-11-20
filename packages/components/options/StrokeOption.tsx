import { type Item } from '~/types/item';
import { Form } from 'react-bootstrap';
import React from 'react';
import { useOptions } from '~/hooks/useOptions';

interface StrokeOptionProps {
    item: Item;
}

const StrokeOption: React.FC<StrokeOptionProps> = ({ item }) => {
    const { enableStroke } = useOptions();

    return (
        <>
            {item.isStrokeable && (
                <div className='d-flex flex-row align-items-center'>
                    <Form.Label>Enable Stroke</Form.Label>
                    <Form.Check
                        className='ms-auto'
                        type='switch'
                        checked={item.isStrokeable ? item.isStokeEnabled : false}
                        onChange={() => enableStroke(item)}
                    />
                </div>
            )}
        </>
    );
};

export default StrokeOption;
