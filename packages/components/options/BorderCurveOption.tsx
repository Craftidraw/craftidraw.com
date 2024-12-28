import { Button, Form } from 'react-bootstrap';
import React from 'react';
import type { Item, RectangleItem } from '~/types/item';
import { useOptions } from '~/hooks/useOptions';

interface BorderCurveOptionProps {
    item: Item;
}

const BorderCurveOption: React.FC<BorderCurveOptionProps> = ({ item }) => {
    const { setBorderRadius } = useOptions();

    return (
        <>
            {(item.type === 'rectangle' || item.type === 'image') && (
                <div className='d-flex flex-column'>
                    <Form.Label style={{ width: '100%' }}>Border Curve</Form.Label>
                    <div>
                        <Button
                            variant='options'
                            active={(item as RectangleItem).borderRadius === 0}
                            onClick={() => setBorderRadius(item, 0)}
                        >
                            Sharp
                        </Button>
                        <Button
                            variant='options'
                            active={(item as RectangleItem).borderRadius === 15}
                            onClick={() => setBorderRadius(item, 15)}
                        >
                            Rounded
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default BorderCurveOption;
