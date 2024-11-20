import LibraryModal from '../LibraryModal';
import type { RootState } from '~/lib/store/store';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { useAppSelector } from '~/lib/store/hooks';

const LibraryAnchor: React.FC = () => {
    const isLibraryOpen = useAppSelector((state: RootState) => state.app.isLibraryOpen);

    return (
        <>
            <Modal show={isLibraryOpen} size='lg'>
                <LibraryModal />
            </Modal>
        </>
    );
};

export default LibraryAnchor;
