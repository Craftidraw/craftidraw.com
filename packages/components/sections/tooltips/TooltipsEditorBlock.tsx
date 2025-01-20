import { Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { type LibraryTooltipConfiguration } from '~/types/library';
import React, { useState } from 'react';
import { useIndexedDB } from '~/hooks/useIndexedDB';
import { type TooltipSettings } from '~/types/item';
import { useConfirmation } from '~/providers/ConfirmationProvider';
import { useFileOperations } from '~/hooks/useFileOperations';

interface CustomTooltipsEditorProps {
    previewMode: boolean;
    selectedTooltip: LibraryTooltipConfiguration;
    handleEditorClose: () => void;
}

const TooltipsEditorBlock =({
    previewMode,
    selectedTooltip,
    handleEditorClose,
}: CustomTooltipsEditorProps) => {
    const { requestConfirmation } = useConfirmation();
    const { updateTooltipConfiguration } = useIndexedDB();
    const { saveTooltipConfigurationToLibrary } = useFileOperations();

    const [alteredTooltip, setAlteredTooltip] = useState<LibraryTooltipConfiguration>(selectedTooltip);

    const isValidHex = (hex: string) => {
        return /^#([A-Fa-f0-9]{6})$/.test(hex);
    };

    const showPreview = (settings: TooltipSettings) => {
        return (
            <div className='d-flex flex-row mt-2'>
                <div
                    className='d-flex col-4'
                    style={{ alignItems: 'center', display: 'block', flexDirection: 'column' }}
                >
                    <h6>Actual Size</h6>
                    <div
                        style={{
                            borderRadius: '5px',
                            borderColor: settings.isStokeEnabled ? settings.strokeColor : 'transparent',
                            borderStyle: settings.strokeStyle,
                            borderWidth: settings.strokeWidth + 'px',
                            backgroundColor: settings.isFillEnabled ? settings.fillColor : 'transparent',
                            color: settings.isFillEnabled ? 'white' : 'black',
                            height: '100px',
                            width: '150px',
                            textAlign: 'center',
                            fontSize: '14px',
                        }}
                    >
                        Test Text
                    </div>
                    <div className='d-flex flex-column'></div>
                </div>
                <div
                    className='d-flex col-8'
                    style={{ alignItems: 'center', display: 'block', flexDirection: 'column' }}
                >
                    <h6>Zoomed Size</h6>
                    <div
                        style={{
                            borderRadius: 'calc(5px * 3)',
                            borderColor: settings.isStokeEnabled ? settings.strokeColor : 'transparent',
                            borderStyle: settings.strokeStyle,
                            borderWidth: 'calc(' + settings.strokeWidth + 'px * 3)',
                            backgroundColor: settings.isFillEnabled ? settings.fillColor : 'transparent',
                            color: settings.isFillEnabled ? 'white' : 'black',
                            height: 'calc(100px * 3)',
                            width: 'calc(150px * 3)',
                            textAlign: 'center',
                            fontSize: 'calc(14px * 3)',
                        }}
                    >
                        Test Text
                    </div>
                    <div className='d-flex flex-column'></div>
                </div>
            </div>
        );
    };

    return (
        <Modal.Body>
            <div className='d-flex' style={{ alignItems: 'center', display: 'block', flexDirection: 'column' }}>
                <h4>Tooltip {previewMode ? 'Preview' : 'Editor'}</h4>
                <p>{selectedTooltip?.name}</p>
            </div>
            <div>
                <div className='d-flex flex-row mt-2'>
                    <div className='d-flex flex-row'>
                        <h6 className='align-self-center me-2' style={{ margin: '0' }}>
                            Name:
                        </h6>
                        <Form.Control
                            type='text'
                            value={alteredTooltip.name}
                            size='sm'
                            disabled={previewMode}
                            onChange={(e) => {
                                setAlteredTooltip({ ...alteredTooltip, name: e.target.value });
                            }}
                        />
                    </div>
                    <div className='ms-auto'>
                        {previewMode ? (
                            <Button
                                title='Clone this configuration'
                                className='me-1'
                                variant='secondary'
                                size='sm'
                                onClick={async () => {
                                    await saveTooltipConfigurationToLibrary(selectedTooltip);
                                    handleEditorClose();
                                }}
                            >
                                Clone
                            </Button>
                        ) : (
                            <Button
                                title='Save this configuration'
                                className='me-1'
                                variant='secondary'
                                size='sm'
                                onClick={async () => {
                                    await requestConfirmation('Are you sure you want to save this configuration?').then(
                                        async (confirmed) => {
                                            if (!confirmed) return;
                                            await updateTooltipConfiguration(alteredTooltip);
                                            handleEditorClose();
                                        },
                                    );
                                }}
                            >
                                Save
                            </Button>
                        )}
                        <Button
                            title='Go back'
                            className='me-1'
                            variant='primary'
                            size='sm'
                            onClick={async () => {
                                await requestConfirmation(
                                    'Are you sure you want to go back? Any unsaved changes will be lost.',
                                ).then((confirmed) => {
                                    if (!confirmed) return;
                                    setAlteredTooltip(selectedTooltip);
                                    handleEditorClose();
                                });
                            }}
                        >
                            Back
                        </Button>
                    </div>
                </div>
            </div>
            {alteredTooltip && (
                <>
                    {showPreview(alteredTooltip.settings)}
                    <Form>
                        <Form.Label>Border Color</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type='text'
                                value={alteredTooltip.settings.strokeColor}
                                disabled={previewMode}
                                onChange={(e) => {
                                    setAlteredTooltip({
                                        ...alteredTooltip,
                                        settings: {
                                            ...alteredTooltip.settings,
                                            strokeColor: e.target.value,
                                        },
                                    });
                                }}
                            />
                            <Form.Control
                                type='color'
                                value={
                                    isValidHex(alteredTooltip.settings.strokeColor ?? '')
                                        ? alteredTooltip.settings.strokeColor
                                        : '#000000'
                                }
                                disabled={previewMode}
                                onChange={(e) => {
                                    setAlteredTooltip({
                                        ...alteredTooltip,
                                        settings: {
                                            ...alteredTooltip.settings,
                                            strokeColor: e.target.value,
                                        },
                                    });
                                }}
                            />
                        </InputGroup>
                        <Form.Label>Border Style</Form.Label>
                        <InputGroup>
                            <Form.Select
                                value={alteredTooltip.settings.strokeStyle}
                                disabled={previewMode}
                                onChange={(e) => {
                                    setAlteredTooltip({
                                        ...alteredTooltip,
                                        settings: {
                                            ...alteredTooltip.settings,
                                            strokeStyle: e.target.value,
                                        },
                                    });
                                }}
                            >
                                <option value='solid'>Solid</option>
                                <option value='dotted'>Dotted</option>
                                <option value='dashed'>Dashed</option>
                            </Form.Select>
                        </InputGroup>
                        <Form.Label>Border Width</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type='number'
                                value={alteredTooltip.settings.strokeWidth}
                                disabled={previewMode}
                                onChange={(e) => {
                                    setAlteredTooltip({
                                        ...alteredTooltip,
                                        settings: {
                                            ...alteredTooltip.settings,
                                            strokeWidth: e.target.value as unknown as number,
                                        },
                                    });
                                }}
                            />
                        </InputGroup>
                        <Form.Label>Fill Color</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type='text'
                                value={
                                    isValidHex(alteredTooltip.settings.fillColor ?? '')
                                        ? alteredTooltip.settings.fillColor
                                        : '#000000'
                                }
                                disabled={previewMode}
                                onChange={(e) => {
                                    setAlteredTooltip({
                                        ...alteredTooltip,
                                        settings: {
                                            ...alteredTooltip.settings,
                                            fillColor: e.target.value,
                                        },
                                    });
                                }}
                            />
                            <Form.Control
                                type='color'
                                value={alteredTooltip.settings.fillColor}
                                disabled={previewMode}
                                onChange={(e) => {
                                    setAlteredTooltip({
                                        ...alteredTooltip,
                                        settings: {
                                            ...alteredTooltip.settings,
                                            fillColor: e.target.value,
                                        },
                                    });
                                }}
                            />
                        </InputGroup>
                    </Form>
                </>
            )}
        </Modal.Body>
    );
};

export default TooltipsEditorBlock;
