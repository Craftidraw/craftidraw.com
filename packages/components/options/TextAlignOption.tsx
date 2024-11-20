import type { Item, TextItem } from '~/types/item';
import { useOptions } from '~/hooks/useOptions';
import { Button, Form } from 'react-bootstrap';
import React from 'react';

interface TextAlignOptionProps {
    item: Item;
}

const TextAlignOption: React.FC<TextAlignOptionProps> = ({ item }) => {
    const { setTextAlign } = useOptions();

    return (
        <>
            {(item.type === 'text' || item.type.includes('item')) && (
                <div className='d-flex flex-column'>
                    <Form.Label style={{ width: '100%' }}>Text Align</Form.Label>
                    <div>
                        <Button
                            variant='options'
                            active={(item as TextItem).textAlign === 'left'}
                            onClick={() => setTextAlign(item, 'left')}
                        >
                            Left
                        </Button>
                        <Button
                            variant='options'
                            active={(item as TextItem).textAlign === 'center'}
                            onClick={() => setTextAlign(item, 'center')}
                        >
                            Center
                        </Button>
                        <Button
                            variant='options'
                            active={(item as TextItem).textAlign === 'right'}
                            onClick={() => setTextAlign(item, 'right')}
                        >
                            Right
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default TextAlignOption;
