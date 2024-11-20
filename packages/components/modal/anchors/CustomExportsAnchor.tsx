import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import CustomExportsModal from '../CustomExportsModal';
import ExportsEditorBlock from '../../sections/exports/ExportsEditorBlock';
import type { LibraryExportConfiguration } from '~/types/library';
import { useAppDispatch, useAppSelector } from '~/lib/store/hooks';
import type { RootState } from '~/lib/store/store';
import { setIsCustomExportsOpen } from '~/lib/store/features/appSlice';

const CustomExportsAnchor: React.FC = () => {
    const dispatch = useAppDispatch();

    const isCustomExportsOpen = useAppSelector((state: RootState) => state.app.isCustomExportsOpen);
    const [selectedConfigurationInModal, setSelectedConfigurationInModal] = useState<LibraryExportConfiguration | null>(
        null,
    );

    const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
    const [isInPreviewMode, setIsInPreviewMode] = useState<boolean>(false);

    const handleEditorOpen = (preview: boolean) => {
        setIsInPreviewMode(preview);
        setIsEditorOpen(true);
        dispatch(setIsCustomExportsOpen(false));
    };

    const handleEditorClose = () => {
        setIsEditorOpen(false);
        setSelectedConfigurationInModal(null);
        dispatch(setIsCustomExportsOpen(true));
    };

    return (
        <>
            <Modal show={isCustomExportsOpen} size='lg'>
                <CustomExportsModal
                    selectedConfigurationInModal={selectedConfigurationInModal}
                    setSelectedConfigurationInModal={setSelectedConfigurationInModal}
                    handleEditorOpen={handleEditorOpen}
                />
            </Modal>
            <Modal show={isEditorOpen} size='lg'>
                <ExportsEditorBlock
                    previewMode={isInPreviewMode}
                    selectedConfigurationInModal={selectedConfigurationInModal!}
                    handleEditorClose={handleEditorClose}
                />
            </Modal>
        </>
    );
};

export default CustomExportsAnchor;
