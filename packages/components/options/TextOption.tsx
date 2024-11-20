import { Form } from 'react-bootstrap';
import { type Item, type TextItem } from '../../types/item';
import { useOptions } from '~/hooks/useOptions';
import React, { useCallback, useEffect } from 'react';
import { debounce } from 'lodash';

interface TextOptionProps {
    item: Item;
}

const TextOption: React.FC<TextOptionProps> = ({ item }) => {
    const { setText } = useOptions();
    const [alteredText, setAlteredText] = React.useState<string>('');

    useEffect(() => {
        if (item.type !== 'text') return;
        setAlteredText((item as TextItem).text);
    }, [item]);

    const debounceTyping = useCallback(
        debounce((item: Item, value: string) => {
            setText(item, value);
        }, 500),
        [],
    );

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setAlteredText(e.target.value);
        debounceTyping(item, e.target.value);
    };

    useEffect(() => {
        debounceTyping.cancel();
    }, [debounceTyping]);

    return (
        <>
            {item.type === 'text' && (
                <div className='d-flex flex-column'>
                    <Form.Label style={{ width: '100%' }}>Text</Form.Label>
                    <Form.Control type='text' size='sm' value={alteredText} onChange={(e) => handleTextChange(e)} />
                </div>
            )}
        </>
    );
};

export default TextOption;
