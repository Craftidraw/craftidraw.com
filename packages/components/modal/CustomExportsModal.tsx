import { Button, Modal } from 'react-bootstrap';
import React, { useState } from 'react';
import ModalNavbar from '../ui/ModalNavbar';
import ExportsPersonalBlock from '../sections/exports/ExportsPersonalBlock';
import type { LibraryExportConfiguration } from '~/types/library';
import ExportsTemplatesBlock from '../sections/exports/ExportsTemplatesBlock';
import { useAppDispatch } from '~/lib/store/hooks';
import { setIsCustomExportsOpen } from '~/lib/store/features/appSlice';

interface CustomExportsModalProps {
    selectedConfigurationInModal: LibraryExportConfiguration | null;
    setSelectedConfigurationInModal: (configuration: LibraryExportConfiguration | null) => void;
    handleEditorOpen: (preview: boolean) => void;
}

const CustomExportsModal: React.FC<CustomExportsModalProps> = ({
    selectedConfigurationInModal,
    setSelectedConfigurationInModal,
    handleEditorOpen,
}) => {
    const dispatch = useAppDispatch();

    const [option, setOption] = useState<string>('personal');

    return (
        <Modal.Body>
            <div className='d-flex' style={{ alignItems: 'center', display: 'block', flexDirection: 'column' }}>
                <h4>Export Configurations</h4>
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
                <ExportsPersonalBlock
                    selectedConfigurationInModal={selectedConfigurationInModal}
                    setSelectedConfigurationInModal={setSelectedConfigurationInModal}
                    handleEditorOpen={handleEditorOpen}
                />
            )}
            {option === 'templates' && (
                <ExportsTemplatesBlock
                    selectedConfigurationInModal={selectedConfigurationInModal}
                    setSelectedConfigurationInModal={setSelectedConfigurationInModal}
                    handleEditorOpen={handleEditorOpen}
                />
            )}
            <hr />
            <small>
                <Button variant='empty' onClick={() => dispatch(setIsCustomExportsOpen(false))}>
                    Go back to your board.
                </Button>
            </small>
        </Modal.Body>
    );
};

export default CustomExportsModal;
