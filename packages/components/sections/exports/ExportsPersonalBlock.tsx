import { Button, Form } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import type { LibraryExportConfiguration } from '~/types/library';
import { useAppDispatch } from '~/lib/store/hooks';
import { useIndexedDB } from '~/hooks/useIndexedDB';
import { useConfirmation } from '~/providers/ConfirmationProvider';
import { useFileOperations } from '~/hooks/useFileOperations';
import { setSelectedConfiguration } from '~/lib/store/features/appSlice';
import ExportConfiguration from '~/components/ui/preview/ExportConfiguration';

interface ExportsPersonalBlockProps {
    selectedConfigurationInModal: LibraryExportConfiguration | null;
    setSelectedConfigurationInModal: (configuration: LibraryExportConfiguration | null) => void;
    handleEditorOpen: (preview: boolean) => void;
}

const ExportsPersonalBlock: React.FC<ExportsPersonalBlockProps> = ({
    selectedConfigurationInModal,
    setSelectedConfigurationInModal,
    handleEditorOpen,
}) => {
    const dispatch = useAppDispatch();
    const { getExportConfigurations, deleteExportConfiguration } = useIndexedDB();
    const { importExportConfiguration, exportExportConfiguration } = useFileOperations();
    const { requestConfirmation } = useConfirmation();

    const [libraryConfigurations, setLibraryConfigurations] = useState<LibraryExportConfiguration[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const loadConfigurations = async () => {
            const configurations = await getExportConfigurations();
            setLibraryConfigurations(configurations);
        };
        void loadConfigurations();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (
                selectedConfigurationInModal &&
                !target.closest('.library-configuration') &&
                !target.closest('button')
            ) {
                setSelectedConfigurationInModal(null);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [selectedConfigurationInModal]);

    const handleExportCreate = () => {
        const newConfiguration: LibraryExportConfiguration = {
            id: libraryConfigurations.length + 1,
            file: new File([], 'New_Export.yml', { type: 'text/plain' }),
            date: new Date(),
        };
        setSelectedConfigurationInModal(newConfiguration);
        handleEditorOpen(false);
    };

    return (
        <>
            <div className='d-flex flex-row mt-2'>
                <div>
                    <Button
                        title='Upload a configuration'
                        className='me-1'
                        variant='secondary'
                        size='sm'
                        onClick={async () => await importExportConfiguration()}
                    >
                        Upload
                    </Button>
                    <Button
                        title='Export a configuration'
                        className='me-1'
                        variant='secondary'
                        size='sm'
                        onClick={async () => await exportExportConfiguration(selectedConfigurationInModal!)}
                    >
                        Export
                    </Button>
                    <Button
                        title='Create a new configuration'
                        variant='secondary'
                        size='sm'
                        onClick={async () => handleExportCreate()}
                    >
                        Create
                    </Button>
                </div>
                <div className='d-flex flex-row ms-auto'>
                    {selectedConfigurationInModal && (
                        <>
                            <Button
                                title='Set as the exporter'
                                className='me-1'
                                variant='primary'
                                size='sm'
                                onClick={() => dispatch(setSelectedConfiguration(selectedConfigurationInModal?.id))}
                            >
                                Set
                            </Button>
                            <Button
                                title='Edit this configuration'
                                className='me-1'
                                variant='primary'
                                size='sm'
                                onClick={() => handleEditorOpen(false)}
                            >
                                Edit
                            </Button>
                        </>
                    )}
                    <Button
                        title='Delete this configuration'
                        className='me-1'
                        variant='secondary'
                        size='sm'
                        onClick={async () => {
                            await requestConfirmation('Are you sure you want to delete this configuration?').then(
                                async (confirmed) => {
                                    if (confirmed) {
                                        await deleteExportConfiguration(selectedConfigurationInModal!.id);
                                        setSelectedConfigurationInModal(null);
                                        setLibraryConfigurations(await getExportConfigurations());
                                    }
                                },
                            );
                        }}
                    >
                        <i className='fa-solid fa-trash'></i>
                    </Button>
                    <Form.Control
                        type='text'
                        placeholder='Search...'
                        value={searchTerm}
                        size='sm'
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className='d-flex flex-row flex-wrap mt-2'>
                {libraryConfigurations
                    .filter((config) => config.file.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((config) => (
                        <ExportConfiguration
                            key={config.id}
                            configuration={config}
                            selectedConfigurationInModal={selectedConfigurationInModal}
                            setSelectedConfigurationInModal={setSelectedConfigurationInModal}
                        />
                    ))}
            </div>
        </>
    );
};

export default ExportsPersonalBlock;
