import { Button, Modal } from 'react-bootstrap';
import React, { useState } from 'react';
import LibraryImageBlock from '../sections/library/LibraryImageBlock';
import ModalNavbar from '../ui/ModalNavbar';
import LibraryItemBlock from '../sections/library/LibraryItemBlock';
import { useAppDispatch } from '~/lib/store/hooks';
import { setIsLibraryOpen } from '~/lib/store/features/appSlice';

const LibraryModal: React.FC = () => {
    const dispatch = useAppDispatch();
    const [option, setOption] = useState('images');

    return (
        <Modal.Body>
            <div className='d-flex' style={{ alignItems: 'center', display: 'block', flexDirection: 'column' }}>
                <h4>Your Library</h4>
            </div>
            <div className='d-flex flex-row' style={{ borderBottom: '1px solid rgb(33, 37, 41, 0.2)' }}>
                <ModalNavbar state={option} setState={setOption} options={['images', 'items']}>
                    <ModalNavbar.Item option='images'>Images</ModalNavbar.Item>
                    <ModalNavbar.Item option='items'>Items</ModalNavbar.Item>
                </ModalNavbar>
            </div>
            {option === 'images' && <LibraryImageBlock />}
            {option === 'items' && <LibraryItemBlock />}
            <hr />
            <small>
                <Button variant='empty' onClick={() => dispatch(setIsLibraryOpen(false))}>
                    Go back to your board.
                </Button>
            </small>
        </Modal.Body>
    );
};

export default LibraryModal;
