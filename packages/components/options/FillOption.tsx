import { type Item } from '~/types/item';
import { Form } from 'react-bootstrap';
import React from 'react';
import { useOptions } from '~/hooks/useOptions';

interface FillOptionProps {
    item: Item;
}

const FillOption: React.FC<FillOptionProps> = ({ item }) => {
    const { enableFill } = useOptions();

    return (
        <>
            {item.isFillable && (
                <div className='d-flex flex-row align-items-center'>
                    <Form.Label>Enable Fill</Form.Label>
                    <Form.Check
                        className='ms-auto'
                        type='switch'
                        checked={item.isFillable ? item.isFillEnabled : false}
                        onChange={() => enableFill(item)}
                    />
                </div>
            )}
        </>
    );
};

export default FillOption;
