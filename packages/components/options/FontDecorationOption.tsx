import type { Item, TextItem } from '~/types/item';
import { useOptions } from '~/hooks/useOptions';
import { Button, Form } from 'react-bootstrap';
import React from 'react';

interface FontDecorationOptionProps {
    item: Item;
}

const FontDecorationOption: React.FC<FontDecorationOptionProps> = ({ item }) => {
    const { setFontDecoration } = useOptions();

    return (
        <>
            {item.type === 'text' && (
                <div className='d-flex flex-column'>
                    <Form.Label style={{ width: '100%' }}>Font Decoration</Form.Label>
                    <div>
                        <Button
                            variant='options'
                            active={(item as TextItem).fontDecoration === 'none'}
                            onClick={() => setFontDecoration(item, 'none')}
                        >
                            None
                        </Button>
                        <Button
                            variant='options'
                            active={(item as TextItem).fontDecoration === 'line-through'}
                            onClick={() => setFontDecoration(item, 'line-through')}
                        >
                            Strikethrough
                        </Button>
                        <Button
                            variant='options'
                            active={(item as TextItem).fontDecoration === 'underline'}
                            onClick={() => setFontDecoration(item, 'underline')}
                        >
                            Underline
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default FontDecorationOption;
