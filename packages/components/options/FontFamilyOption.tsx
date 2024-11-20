import type { Item } from '~/types/item';
import { useOptions } from '~/hooks/useOptions';
import { Button, Form } from 'react-bootstrap';
import React from 'react';

interface FontFamilyOptionProps {
    item: Item;
}

const FontFamilyOption: React.FC<FontFamilyOptionProps> = ({ item }) => {
    const { setFontFamily } = useOptions();

    return (
        <>
            {item.type === 'text' && (
                <div className='d-flex flex-column'>
                    <Form.Label style={{ width: '100%' }}>Font Family</Form.Label>
                    <div>
                        <Button variant='secondary' onClick={() => {}}>
                            Browse
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default FontFamilyOption;
