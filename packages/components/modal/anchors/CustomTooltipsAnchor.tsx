import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import CustomTooltipsModal from '../CustomTooltipsModal';
import type { LibraryTooltipConfiguration } from '~/types/library';
import TooltipsEditorBlock from '../../sections/tooltips/TooltipsEditorBlock';
import type { RootState } from '~/lib/store/store';
import { useAppDispatch, useAppSelector } from '~/lib/store/hooks';
import { setIsCustomTooltipsOpen } from '~/lib/store/features/appSlice';

const CustomTooltipsAnchor: React.FC = () => {
    const dispatch = useAppDispatch();
    const isCustomTooltipsOpen = useAppSelector((state: RootState) => state.app.isCustomTooltipsOpen);

    const [selectedTooltip, setSelectedTooltip] = useState<LibraryTooltipConfiguration | null>(null);
    const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
    const [isInPreviewMode, setIsInPreviewMode] = useState<boolean>(false);

    const handleEditorOpen = (preview: boolean) => {
        setIsInPreviewMode(preview);
        setIsEditorOpen(true);
        dispatch(setIsCustomTooltipsOpen(false));
    };

    const handleEditorClose = () => {
        setIsEditorOpen(false);
        setSelectedTooltip(null);
        dispatch(setIsCustomTooltipsOpen(true));
    };

    return (
        <>
            <Modal show={isCustomTooltipsOpen} size='lg'>
                <CustomTooltipsModal
                    selectedTooltip={selectedTooltip}
                    setSelectedTooltip={setSelectedTooltip}
                    handleEditorOpen={handleEditorOpen}
                />
            </Modal>
            <Modal show={isEditorOpen} size='lg'>
                <TooltipsEditorBlock
                    previewMode={isInPreviewMode}
                    selectedTooltip={selectedTooltip!}
                    handleEditorClose={handleEditorClose}
                />
            </Modal>
        </>
    );
};

export default CustomTooltipsAnchor;
