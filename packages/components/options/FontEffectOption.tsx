import type { Item, TextItem } from '~/types/item';
import { useOptions } from '~/hooks/useOptions';
import { Button, Form } from 'react-bootstrap';
import React from 'react';

interface FontEffectOptionProps {
    item: Item;
}

const FontEffectOption: React.FC<FontEffectOptionProps> = ({ item }) => {
    const { setFontEffect } = useOptions();

    return (
        <>
            {(item.type === 'text' || item.type.includes('item')) && (
                <div className='d-flex flex-column'>
                    <Form.Label style={{ width: '100%' }}>Font Effect</Form.Label>
                    <div>
                        <Button
                            variant='options'
                            active={(item as TextItem).fontEffect === 'normal'}
                            onClick={() => setFontEffect(item, 'clear')}
                        >
                            Clear
                        </Button>
                        <Button
                            variant='options'
                            active={(item as TextItem).fontEffect?.includes('bold')}
                            onClick={() => setFontEffect(item, 'bold')}
                        >
                            Bold
                        </Button>
                        <Button
                            variant='options'
                            active={(item as TextItem).fontEffect?.includes('italic')}
                            onClick={() => setFontEffect(item, 'italic')}
                        >
                            Italic
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default FontEffectOption;
