import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import type { LibraryExportConfiguration } from '~/types/library';
import { useAppDispatch } from '~/lib/store/hooks';
import { setSelectedConfiguration } from '~/lib/store/features/appSlice';
import ExportConfiguration from '~/components/ui/preview/ExportConfiguration';

interface ExportsTemplatesBlockProps {
    selectedConfigurationInModal: LibraryExportConfiguration | null;
    setSelectedConfigurationInModal: (configuration: LibraryExportConfiguration | null) => void;
    handleEditorOpen: (preview: boolean) => void;
}

interface TemplateConfig {
    path: string;
    name: string;
    type: string;
}

const TEMPLATE_CONFIGURATIONS: TemplateConfig[] = [
    {
        path: '/unity_item_creator.cs',
        name: 'unity_item_creator.cs',
        type: 'text/x-csharp',
    },
    {
        path: '/unreal_item_creator.cpp',
        name: 'unreal_item_creator.cpp',
        type: 'text/x-c++src',
    },
    {
        path: '/json_template.json',
        name: 'json_template.json',
        type: 'application/json',
    },
    {
        path: '/flrp_plugins_configuration.yml',
        name: 'flrp_plugins_configuration.yml',
        type: 'text/yaml',
    },
    {
        path: '/java_template.java',
        name: 'java_template.java',
        type: 'text/x-java',
    },
    {
        path: '/lua_template.lua',
        name: 'lua_template.lua',
        type: 'text/x-lua',
    },
    {
        path: '/javascript_template.js',
        name: 'javascript_template.js',
        type: 'text/javascript',
    },
    {
        path: '/python_template.py',
        name: 'python_template.py',
        type: 'text/x-python',
    },
];

const BASE_PATH = '/api/templates';

const ExportsTemplatesBlock: React.FC<ExportsTemplatesBlockProps> = ({
    selectedConfigurationInModal,
    setSelectedConfigurationInModal,
    handleEditorOpen,
}) => {
    const dispatch = useAppDispatch();
    const [templateConfigurations, setTemplateConfigurations] = useState<LibraryExportConfiguration[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchConfigurations = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const fetchedConfigs = await Promise.all(
                TEMPLATE_CONFIGURATIONS.map(async (config, index) => {
                    try {
                        const response = await fetch(`${BASE_PATH}${config.path}`);

                        if (!response.ok) {
                            throw new Error(`Failed to fetch ${config.name}`);
                        }

                        const blob = await response.blob();
                        const file = new File([blob], config.name, { type: config.type });

                        return {
                            id: index + 999,
                            file,
                            date: new Date(),
                        };
                    } catch (err) {
                        console.error(`Error fetching ${config.name}:`, err);
                        throw err;
                    }
                }),
            );

            setTemplateConfigurations(fetchedConfigs);
        } catch (err) {
            setError('Failed to load template configurations');
            console.error('Error fetching configurations:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConfigurations();
    }, [fetchConfigurations]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const isConfigurationClick = target.closest('.library-configuration');
            const isButtonClick = target.closest('button');

            if (selectedConfigurationInModal && !isConfigurationClick && !isButtonClick) {
                setSelectedConfigurationInModal(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [selectedConfigurationInModal, setSelectedConfigurationInModal]);

    const handleSetConfiguration = () => {
        if (selectedConfigurationInModal) {
            dispatch(setSelectedConfiguration(selectedConfigurationInModal.id));
            setSelectedConfigurationInModal(null);
        }
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredConfigurations = templateConfigurations.filter((config) =>
        config.file.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (error) {
        return (
            <div className='alert alert-danger' role='alert'>
                {error}
            </div>
        );
    }

    return (
        <div className='exports-templates-block'>
            <div className='d-flex flex-row mt-2'>
                <div className='d-flex flex-row ms-auto'>
                    {selectedConfigurationInModal && (
                        <>
                            <Button
                                title='Preview this configuration'
                                variant='primary'
                                className='me-1'
                                size='sm'
                                onClick={() => handleEditorOpen(true)}
                            >
                                Preview
                            </Button>
                        </>
                    )}
                    <Form.Control
                        type='text'
                        placeholder='Search templates...'
                        value={searchTerm}
                        size='sm'
                        onChange={handleSearch}
                        aria-label='Search templates'
                    />
                </div>
            </div>

            <div className='d-flex flex-row flex-wrap mt-2'>
                {isLoading ? (
                    <div className='d-flex justify-content-center w-100'>
                        <div className='spinner-border text-primary' role='status'>
                            <span className='visually-hidden'>Loading...</span>
                        </div>
                    </div>
                ) : (
                    filteredConfigurations.map((config) => (
                        <ExportConfiguration
                            key={config.id}
                            configuration={config}
                            selectedConfigurationInModal={selectedConfigurationInModal}
                            setSelectedConfigurationInModal={setSelectedConfigurationInModal}
                        />
                    ))
                )}

                {!isLoading && filteredConfigurations.length === 0 && (
                    <div className='alert alert-info w-100 text-center' role='alert'>
                        No templates found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExportsTemplatesBlock;
