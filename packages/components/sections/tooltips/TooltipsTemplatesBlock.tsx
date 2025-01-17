import React, { useEffect, useState } from 'react';
import type { LibraryTooltipConfiguration } from '~/types/library';
import { Button, Form } from 'react-bootstrap';
import TooltipPreview from '../../ui/preview/TooltipPreview';
import { type Tooltip, type CustomItem } from '~/types/item';
import { type RootState } from '~/lib/store/store';
import { useAppDispatch, useAppSelector } from '~/lib/store/hooks';
import { selectItemById, setIsCustomTooltipsOpen, setItem, setSelectedItem } from '~/lib/store/features/appSlice';
import { useItem } from '~/hooks/useItem';

interface TooltipsTemplatesBlockProps {
    selectedTooltip: LibraryTooltipConfiguration | null;
    setSelectedTooltip: (configuration: LibraryTooltipConfiguration | null) => void;
    handleEditorOpen: (preview: boolean) => void;
}

const TooltipsTemplatesBlock: React.FC<TooltipsTemplatesBlockProps> = ({
    selectedTooltip,
    setSelectedTooltip,
    handleEditorOpen,
}) => {
    const dispatch = useAppDispatch();
    const { updateItem } = useItem();

    const selectedItem = useAppSelector((state: RootState) => state.app.selectedItem);
    const currentItem = useAppSelector((state: RootState) => selectItemById(state, selectedItem ?? ''));

    const [templateTooltips, setTemplateTooltips] = useState<LibraryTooltipConfiguration[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const loadTooltipTemplates = async () => {
            const tooltips: LibraryTooltipConfiguration[] = [
                {
                    id: 999,
                    name: 'Minecraft Default Tooltip',
                    settings: {
                        strokeColor: '#250945',
                        strokeStyle: 'solid',
                        strokeWidth: 4,
                        isStokeEnabled: true,
                        fillColor: '#1c0b1b',
                        isFillEnabled: true,
                    },
                },
            ];
            setTemplateTooltips(tooltips);
        };

        void loadTooltipTemplates();
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
    }, [setSelectedTooltip, selectedTooltip]);

    const handleTooltipSelect = () => {
        if (!selectedTooltip) return;
        if (!currentItem) return;
        if (currentItem.type !== 'custom') return;

        const item = {
            ...currentItem,
            tooltip: {
                ...(currentItem as CustomItem).tooltip,
                config: selectedTooltip,
            } as Tooltip,
        };

        updateItem(item, currentItem);

        setSelectedTooltip(null);
        dispatch(setIsCustomTooltipsOpen(false));
    };

    return (
        <div>
            <div className='d-flex flex-row mt-2'>
                <div className='d-flex flex-row ms-auto'>
                    {selectedTooltip && (
                        <>
                            {currentItem && currentItem.type === 'custom' && (
                                <Button
                                    title='Select this configuration'
                                    className='me-1'
                                    variant='primary'
                                    size='sm'
                                    onClick={() => {
                                        handleTooltipSelect();
                                    }}
                                >
                                    Set
                                </Button>
                            )}
                            <Button
                                title='Preview this configuration'
                                className='me-1'
                                variant='primary'
                                size='sm'
                                onClick={() => {
                                    handleEditorOpen(true);
                                }}
                            >
                                Preview
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
                {templateTooltips.map((tooltip) => (
                    <div
                        className='d-flex col-3 library-tooltip'
                        onClick={() => {
                            setSelectedTooltip(tooltip);
                        }}
                        key={tooltip.id + '-temp'}
                    >
                        <div
                            className={
                                'd-flex flex-column align-items-center library-tooltip-container' +
                                (selectedTooltip?.id === tooltip.id ? ' selected' : '')
                            }
                        >
                            <div className='library-tooltip-image-container'>
                                <TooltipPreview settings={tooltip.settings} />
                            </div>
                            <div
                                className='d-flex flex-column library-tooltip-details'
                                style={{ width: '100%', height: '100%' }}
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

export default TooltipsTemplatesBlock;
