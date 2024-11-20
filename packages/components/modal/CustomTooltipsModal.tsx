import { Button, Modal } from 'react-bootstrap';
import React, { useState } from 'react';
import type { LibraryTooltipConfiguration } from '~/types/library';
import ModalNavbar from '../ui/ModalNavbar';
import TooltipsPersonalBlock from '../sections/tooltips/TooltipsPersonalBlock';
import TooltipsTemplatesBlock from '../sections/tooltips/TooltipsTemplatesBlock';
import { useAppDispatch } from '~/lib/store/hooks';
import { setIsCustomTooltipsOpen } from '~/lib/store/features/appSlice';

interface CustomTooltipsModalProps {
    selectedTooltip: LibraryTooltipConfiguration | null;
    setSelectedTooltip: (tooltip: LibraryTooltipConfiguration | null) => void;
    handleEditorOpen: (preview: boolean) => void;
}

const CustomTooltipsModal: React.FC<CustomTooltipsModalProps> = ({
    selectedTooltip,
    setSelectedTooltip,
    handleEditorOpen,
}) => {
    const dispatch = useAppDispatch();

    const [option, setOption] = useState<string>('personal');

    return (
        <Modal.Body>
            <div className='d-flex' style={{ alignItems: 'center', display: 'block', flexDirection: 'column' }}>
                <h4>Tooltip Configurations</h4>
            </div>
            <div className='d-flex flex-row' style={{ borderBottom: '1px solid rgb(33, 37, 41, 0.2)' }}>
                <ModalNavbar state={option} setState={setOption} options={['personal', 'templates', 'community']}>
                    <ModalNavbar.Item option='personal'>Personal</ModalNavbar.Item>
                    <ModalNavbar.Item option='templates'>Templates</ModalNavbar.Item>
                    <ModalNavbar.Item option='community' disabled={true}>
                        Community
                    </ModalNavbar.Item>
                </ModalNavbar>
            </div>
            {option === 'personal' && (
                <TooltipsPersonalBlock
                    selectedTooltip={selectedTooltip}
                    setSelectedTooltip={setSelectedTooltip}
                    handleEditorOpen={handleEditorOpen}
                />
            )}
            {option === 'templates' && (
                <TooltipsTemplatesBlock
                    selectedTooltip={selectedTooltip}
                    setSelectedTooltip={setSelectedTooltip}
                    handleEditorOpen={handleEditorOpen}
                />
            )}
            <hr />
            <small>
                <Button variant='empty' onClick={() => dispatch(setIsCustomTooltipsOpen(false))}>
                    Go back to your board.
                </Button>
            </small>
        </Modal.Body>
    );
};

export default CustomTooltipsModal;
