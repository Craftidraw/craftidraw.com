import { useOptions } from '~/hooks/useOptions';
import type { Item, TextItem } from '~/types/item';
import { Button, Form } from 'react-bootstrap';
import React from 'react';

interface FontSizeOptionProps {
    item: Item;
}

const FontSizeOption: React.FC<FontSizeOptionProps> = ({ item }) => {
    const { setFontSize } = useOptions();

    return (
        <>
            {(item.type === 'text' || item.type.includes('item')) && (
                <div className='d-flex flex-column'>
                    <Form.Label style={{ width: '100%' }}>Font Size</Form.Label>
                    <div>
                        <Button
                            variant='options'
                            active={(item as TextItem).fontSize === 10}
                            onClick={() => setFontSize(item, 10)}
                        >
                            S
                        </Button>
                        <Button
                            variant='options'
                            active={(item as TextItem).fontSize === 12}
                            onClick={() => setFontSize(item, 12)}
                        >
                            M
                        </Button>
                        <Button
                            variant='options'
                            active={(item as TextItem).fontSize === 14}
                            onClick={() => setFontSize(item, 14)}
                        >
                            L
                        </Button>
                        <Button
                            variant='options'
                            active={(item as TextItem).fontSize === 16}
                            onClick={() => setFontSize(item, 16)}
                        >
                            XL
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default FontSizeOption;
