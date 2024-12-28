import React, { useEffect, useState } from 'react';
import type { LibraryExportConfiguration } from '~/types/library';
import { Button, Form, Modal } from 'react-bootstrap';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism';
import { nord as theme } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Editor } from '@monaco-editor/react';
import { useConfirmation } from '~/providers/ConfirmationProvider';
import { useIndexedDB } from '~/hooks/useIndexedDB';
import { useShortcut } from '~/hooks/useShortcut';

interface CustomExportsEditorProps {
    previewMode: boolean;
    selectedConfigurationInModal: LibraryExportConfiguration;
    handleEditorClose: () => void;
}

const ExportsEditorBlock: React.FC<CustomExportsEditorProps> = ({
    previewMode,
    selectedConfigurationInModal,
    handleEditorClose,
}) => {
    const { requestConfirmation } = useConfirmation();
    const { saveExportConfigurationToLibrary } = useShortcut();
    const { updateExportConfiguration } = useIndexedDB();

    const [fileType, setFileType] = useState('');
    const [fileName, setFileName] = useState('');
    const [fileContents, setFileContents] = useState('');
    const [alteredFileContents, setAlteredFileContents] = useState('');
    const [showOriginal, setShowOriginal] = useState(false);

    useEffect(() => {
        if (selectedConfigurationInModal) {
            const fileExtension = selectedConfigurationInModal.file.name.split('.').pop();
            switch (fileExtension) {
                case 'yml':
                case 'yaml':
                    setFileType('yaml');
                    break;
                case 'json':
                    setFileType('json');
                    break;
                case 'java':
                    setFileType('java');
                    break;
                case 'cs':
                    setFileType('csharp');
                    break;
                case 'cpp':
                    setFileType('cpp');
                    break;
                case 'lua':
                    setFileType('lua');
                    break;
                case 'js':
                    setFileType('javascript');
                    break;
                case 'py':
                    setFileType('python');
                    break;
                default:
                    setFileType('');
            }
            void selectedConfigurationInModal.file.text().then((contents: React.SetStateAction<string>) => {
                setFileName(selectedConfigurationInModal.file.name);
                setFileContents(contents);
                setAlteredFileContents(contents);
            });
        }
    }, [selectedConfigurationInModal]);

    return (
        <Modal.Body>
            <div className='d-flex' style={{ alignItems: 'center', display: 'block', flexDirection: 'column' }}>
                <h4>Configuration {previewMode ? 'Preview' : 'Editor'}</h4>
                <p>{selectedConfigurationInModal?.file.name}</p>
            </div>
            <div>
                <div className='d-flex flex-row mt-2'>
                    <div className='d-flex flex-row'>
                        <h6 className='align-self-center me-2' style={{ margin: '0' }}>
                            Name:
                        </h6>
                        <Form.Control
                            type='text'
                            value={fileName}
                            size='sm'
                            disabled={previewMode}
                            onChange={(e) => setFileName(e.target.value)}
                        />
                    </div>
                    {!previewMode && (
                        <div className='align-self-center mx-2'>
                            <Form.Check
                                label='Show Original File'
                                checked={showOriginal}
                                onClick={() => setShowOriginal(!showOriginal)}
                                style={{ marginTop: '2px', fontSize: '14px' }}
                                readOnly={true}
                            />
                        </div>
                    )}
                    <div className='ms-auto'>
                        {previewMode ? (
                            <Button
                                title='Clone this configuration'
                                className='me-1'
                                variant='secondary'
                                size='sm'
                                onClick={async () => {
                                    await saveExportConfigurationToLibrary(selectedConfigurationInModal);
                                    handleEditorClose();
                                }}
                            >
                                Clone
                            </Button>
                        ) : (
                            <Button
                                className='me-1'
                                variant='secondary'
                                size='sm'
                                onClick={async () => {
                                    await requestConfirmation('Are you sure you want to save this configuration?').then(
                                        async (confirmed) => {
                                            if (confirmed) {
                                                await updateExportConfiguration(
                                                    selectedConfigurationInModal,
                                                    alteredFileContents,
                                                    fileName,
                                                );
                                                handleEditorClose();
                                            }
                                        },
                                    );
                                }}
                            >
                                Save
                            </Button>
                        )}
                        <Button
                            className='me-1'
                            variant='primary'
                            size='sm'
                            onClick={async () => {
                                await requestConfirmation('Are you sure you want to go back?').then((confirmed) => {
                                    if (confirmed) {
                                        setAlteredFileContents(fileContents);
                                        handleEditorClose();
                                    }
                                });
                            }}
                        >
                            Back
                        </Button>
                    </div>
                </div>
            </div>
            <div>
                {((!previewMode && showOriginal) || previewMode) && (
                    <>
                        {!previewMode && <h6 className='mt-3'>Original File</h6>}
                        <div className='configuration-preview'>
                            <SyntaxHighlighter
                                language={fileType}
                                showLineNumbers={true}
                                wrapLines={true}
                                style={theme}
                            >
                                {fileContents}
                            </SyntaxHighlighter>
                        </div>
                    </>
                )}
                {!previewMode && (
                    <div className='configuration-editor'>
                        <Editor
                            height='500px'
                            defaultLanguage={fileType}
                            value={alteredFileContents}
                            onChange={(value) => setAlteredFileContents(value!)}
                            options={{
                                minimap: {
                                    enabled: false,
                                },
                                matchBrackets: 'never',
                            }}
                            onMount={(editor, monaco) => {
                                fetch('/api/themes/Nord.json')
                                    .then((data) => data.json())
                                    .then((data) => {
                                        monaco.editor.defineTheme('nord', data);
                                        monaco.editor.setTheme('nord');
                                    })
                                    .catch((error) => {
                                        console.error('Error loading theme:', error);
                                    });
                            }}
                        />
                    </div>
                )}
            </div>
        </Modal.Body>
    );
};

export default ExportsEditorBlock;
