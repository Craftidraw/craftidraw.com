import type { Item } from '~/types/item';
import { Button, Form } from 'react-bootstrap';
import React from 'react';
import { useAppDispatch } from '~/lib/store/hooks';
import { setIsLibraryOpen } from '~/lib/store/features/appSlice';

interface ImageOptionProps {
    item: Item;
}

const ImageOption: React.FC<ImageOptionProps> = ({ item }) => {
    const dispatch = useAppDispatch();

    const handleImageSelect = () => {
        dispatch(setIsLibraryOpen(true));
    };

    return (
        <>
            {(item.type === 'image' || item.type === 'custom') && (
                <div className='d-flex flex-column'>
                    <Form.Label style={{ width: '100%' }}>Image</Form.Label>
                    <div>
                        <Button variant='secondary' onClick={() => handleImageSelect()}>
                            Browse
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ImageOption;
