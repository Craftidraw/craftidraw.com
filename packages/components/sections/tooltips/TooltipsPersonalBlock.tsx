import type { LibraryTooltipConfiguration } from '~/types/library';
import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import TooltipPreview from '../../ui/preview/TooltipPreview';
import { useIndexedDB } from '~/hooks/useIndexedDB';
import type { CustomItem } from '~/types/item';
import { useAppDispatch, useAppSelector } from '~/lib/store/hooks';
import type { RootState } from '~/lib/store/store';
import { setIsCustomTooltipsOpen, setItem, setSelectedItem } from '~/lib/store/features/appSlice';
import { useConfirmation } from '~/providers/ConfirmationProvider';
import { useShortcut } from '~/hooks/useShortcut';

interface TooltipsPersonalBlockProps {
    selectedTooltip: LibraryTooltipConfiguration | null;
    setSelectedTooltip: (configuration: LibraryTooltipConfiguration | null) => void;
    handleEditorOpen: (preview: boolean) => void;
}

const TooltipsPersonalBlock: React.FC<TooltipsPersonalBlockProps> = ({
    selectedTooltip,
    setSelectedTooltip,
    handleEditorOpen,
}) => {
    const dispatch = useAppDispatch();
    const { requestConfirmation } = useConfirmation();
    const { getTooltipConfigurations, deleteTooltipConfiguration } = useIndexedDB();
    const { exportTooltipConfiguration, importTooltipConfiguration } = useShortcut();

    const selectedItem = useAppSelector((state: RootState) => state.app.selectedItem);

    const [libraryTooltips, setLibraryTooltips] = useState<LibraryTooltipConfiguration[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const loadLibraryTooltips = async () => {
            const tooltips: LibraryTooltipConfiguration[] = await getTooltipConfigurations();
            setLibraryTooltips(tooltips);
        };
        loadLibraryTooltips();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (selectedTooltip && !target.closest('.library-tooltip') && !target.closest('button')) {
                setSelectedTooltip(null);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [selectedTooltip]);

    const handleTooltipSelect = () => {
        if (!selectedTooltip) return;
        if (!selectedItem) return;
        if (selectedItem.type !== 'custom') return;

        const item = {
            ...selectedItem,
            tooltipSettings: selectedTooltip,
        } as CustomItem;

        dispatch(setItem(item));
        dispatch(setSelectedItem(item));

        setSelectedTooltip(null);
        dispatch(setIsCustomTooltipsOpen(false));
    };

    const handleTooltipCreate = async () => {
        const newConfiguration: LibraryTooltipConfiguration = {
            id: libraryTooltips.length + 1,
            name: 'New Tooltip ' + libraryTooltips.length,
            tooltip: {
                strokeColor: '#363636',
                strokeStyle: 'solid',
                strokeWidth: 1,
                isStokeEnabled: true,
                fillColor: '#151515',
                isFillEnabled: true,
            },
        };
        setSelectedTooltip(newConfiguration);
        handleEditorOpen(false);
    };

    return (
        <div>
            <div className='d-flex flex-row mt-2'>
                <div>
                    <Button
                        title='Upload a configuration'
                        className='me-1'
                        variant='secondary'
                        size='sm'
                        onClick={async () => await importTooltipConfiguration()}
                    >
                        Upload
                    </Button>
                    <Button
                        title='Export a configuration'
                        className='me-1'
                        variant='secondary'
                        size='sm'
                        onClick={async () => await exportTooltipConfiguration(selectedTooltip!)}
                    >
                        Export
                    </Button>
                    <Button
                        title='Create a new configuration'
                        variant='secondary'
                        size='sm'
                        onClick={async () => await handleTooltipCreate()}
                    >
                        Create
                    </Button>
                </div>
                <div className='d-flex flex-row ms-auto'>
                    {selectedTooltip && (
                        <>
                            {selectedItem && selectedItem.type === 'custom' && (
                                <Button
                                    title='Select this configuration'
                                    className='me-1'
                                    variant='primary'
                                    size='sm'
                                    onClick={() => handleTooltipSelect()}
                                >
                                    Set
                                </Button>
                            )}
                            <Button
                                title='Edit this configuration'
                                className='me-1'
                                variant='primary'
                                size='sm'
                                onClick={() => handleEditorOpen(false)}
                            >
                                Edit
                            </Button>
                            <Button
                                title='Delete this configuration'
                                className='me-1'
                                variant='secondary'
                                size='sm'
                                onClick={async () => {
                                    await requestConfirmation(
                                        'Are you sure you want to delete this configuration?',
                                    ).then(async (confirmed) => {
                                        if (confirmed) {
                                            await deleteTooltipConfiguration(selectedTooltip.name);
                                        }
                                    });
                                }}
                            >
                                <i className='fa-solid fa-trash'></i>
                            </Button>
                        </>
                    )}
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
                {libraryTooltips.map((tooltip, index) => (
                    <div
                        key={index}
                        className='d-flex col-3 library-tooltip'
                        onClick={() => {
                            setSelectedTooltip(tooltip);
                        }}
                    >
                        <div
                            className={
                                'd-flex flex-column align-items-center library-tooltip-container' +
                                (selectedTooltip?.id === tooltip.id ? ' selected' : '')
                            }
                        >
                            <div className='library-tooltip-image-container'>
                                {tooltip?.tooltip && <TooltipPreview tooltip={tooltip.tooltip} />}
                            </div>
                            <div
                                className='d-flex flex-column library-tooltip-details tooltip-details'
                            >
                                <div className='mt-auto'>
                                    <h6>{tooltip.name}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TooltipsPersonalBlock;
