import { Dropdown, DropdownButton, Form } from 'react-bootstrap';
import type { RootState } from '~/lib/store/store';
import React, { useState, useMemo } from 'react';
import { setIsSaved, updateBoard } from '~/lib/store/features/appSlice';
import { useAppDispatch, useAppSelector } from '~/lib/store/hooks';
import { useTheme } from '~/providers/ThemeProvider';
import { useConfirmation } from '~/providers/ConfirmationProvider';
import { DEFAULT_BOARD } from '~/utils/defaults';
import { debounce } from 'lodash';
import type { Board } from '~/types/board';
import { useStorage } from '~/providers/StorageProvider';

const ColorPicker = ({
    value,
    onChange,
    label,
}: {
    value: string;
    onChange: (color: string) => void;
    label: string;
}) => {
    return (
        <div className='d-flex align-items-center w-100'>
            <Form.Label>{label}</Form.Label>
            <div className='ms-auto d-flex align-items-center'>
                <Form.Control
                    type='color'
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        padding: '2px',
                        height: '28px',
                        width: '4rem',
                    }}
                />
            </div>
        </div>
    );
};

const NavbarPreferencesDropdown = () => {
    const dispatch = useAppDispatch();
    const { theme, setTheme, isDark } = useTheme();
    const { requestConfirmation } = useConfirmation();
    const { requestBoardSave } = useStorage();

    const board = useAppSelector((state: RootState) => state.app.board);

    const [localSettings, setLocalSettings] = useState({
        gridSpacing: board.gridSpacing ?? 100,
        snapIncrement: board.snapIncrement ?? 5,
        gridLineColor: board.gridLineColor ?? '#808080',
        gridLineWidth: board.gridLineWidth ?? 1,
        gridLineOpacity: board.gridLineOpacity ?? 0.1,
        gridSubLineColor: board.gridSubLineColor ?? '#808080',
        gridSubLineWidth: board.gridSubLineWidth ?? 1,
        gridSubLineOpacity: board.gridSubLineOpacity ?? 0.05,
        backgroundColor: board.backgroundColor ?? (isDark ? '#121212' : '#ffffff'),
    });

    const debouncedUpdateBoard = useMemo(
        () =>
            debounce((updates: Partial<Board>) => {
                dispatch(setIsSaved('pending'));
                dispatch(updateBoard({ ...board, ...updates } as Board));
                requestBoardSave({ ...board, ...updates } as Board, (success) => {
                    if (!success) {
                        console.error('Failed to save board');
                        dispatch(setIsSaved('failure'));
                    } else {
                        dispatch(setIsSaved('saved'));
                    }
                });
            }, 300),
        [board, dispatch, requestBoardSave],
    );

    return (
        <DropdownButton variant='empty' title='Preferences' autoClose='outside'>
            <Dropdown.Item disabled={true}>
                <small>These options only apply to this board.</small>
            </Dropdown.Item>
            <Dropdown.Item
                onClick={() => {
                    dispatch(updateBoard({ ...board, enableGrid: !board.enableGrid }));
                }}
            >
                Enable Grid
                <Form.Check className='ms-auto' type='switch' id='grid' checked={board.enableGrid} readOnly />
            </Dropdown.Item>
            <Dropdown.Item>
                Grid Spacing
                <Form.Control
                    className='ms-auto'
                    type='number'
                    size='sm'
                    value={localSettings.gridSpacing}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) {
                            setLocalSettings({ ...localSettings, gridSpacing: val });
                            debouncedUpdateBoard({ gridSpacing: val });
                        }
                    }}
                    min={1}
                    max={1000}
                    step={1}
                    style={{
                        maxWidth: '4rem',
                        fontSize: '12px',
                        padding: '0.25rem',
                    }}
                />
            </Dropdown.Item>
            <Dropdown.Item
                onClick={(e) => {
                    e.stopPropagation();
                    dispatch(updateBoard({ ...board, snapToGrid: !board?.snapToGrid }));
                }}
            >
                Snap to Grid
                <Form.Check className='ms-auto' type='switch' id='snapGrid' checked={board.snapToGrid} readOnly />
            </Dropdown.Item>
            <Dropdown.Item>
                Snap Increment
                <Form.Control
                    className='ms-auto'
                    size='sm'
                    type='number'
                    value={localSettings.snapIncrement}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) {
                            setLocalSettings({ ...localSettings, snapIncrement: val });
                            debouncedUpdateBoard({ snapIncrement: val });
                        }
                    }}
                    min={1}
                    max={100}
                    step={1}
                    style={{
                        maxWidth: '4rem',
                        fontSize: '12px',
                        padding: '0.25rem',
                    }}
                />
            </Dropdown.Item>
            <Dropdown.Item>
                <ColorPicker
                    label='Grid Line Color'
                    value={localSettings.gridLineColor}
                    onChange={(e) => {
                        setLocalSettings({ ...localSettings, gridLineColor: e });
                        debouncedUpdateBoard({ gridLineColor: e });
                    }}
                />
            </Dropdown.Item>
            <Dropdown.Item>
                Grid Line Width
                <Form.Control
                    className='ms-auto'
                    type='number'
                    size='sm'
                    value={localSettings.gridLineWidth}
                    onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val)) {
                            setLocalSettings({ ...localSettings, gridLineWidth: val });
                            debouncedUpdateBoard({ gridLineWidth: val });
                        }
                    }}
                    min={0}
                    max={10}
                    step={0.1}
                    style={{
                        maxWidth: '4rem',
                        fontSize: '12px',
                        padding: '0.25rem',
                    }}
                />
            </Dropdown.Item>
            <Dropdown.Item>
                Grid Line Opacity
                <Form.Control
                    className='ms-auto'
                    type='number'
                    size='sm'
                    value={localSettings.gridLineOpacity}
                    onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val)) {
                            setLocalSettings({ ...localSettings, gridLineOpacity: val });
                            debouncedUpdateBoard({ gridLineOpacity: val });
                        }
                    }}
                    min={0}
                    max={1}
                    step={0.01}
                    style={{
                        maxWidth: '4rem',
                        fontSize: '12px',
                        padding: '0.25rem',
                    }}
                />
            </Dropdown.Item>
            <Dropdown.Item>
                <ColorPicker
                    label='Grid Sub Line Color'
                    value={localSettings.gridSubLineColor}
                    onChange={(e) => {
                        setLocalSettings({ ...localSettings, gridSubLineColor: e });
                        debouncedUpdateBoard({ gridSubLineColor: e });
                    }}
                />
            </Dropdown.Item>
            <Dropdown.Item>
                Grid Sub Line Width
                <Form.Control
                    className='ms-auto'
                    type='number'
                    size='sm'
                    value={localSettings.gridSubLineWidth}
                    onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val)) {
                            setLocalSettings({ ...localSettings, gridSubLineWidth: val });
                            debouncedUpdateBoard({ gridSubLineWidth: val });
                        }
                    }}
                    min={0}
                    max={10}
                    step={0.1}
                    style={{
                        maxWidth: '4rem',
                        fontSize: '12px',
                        padding: '0.25rem',
                    }}
                />
            </Dropdown.Item>
            <Dropdown.Item>
                Grid Sub Line Opacity
                <Form.Control
                    className='ms-auto'
                    type='number'
                    size='sm'
                    value={localSettings.gridSubLineOpacity}
                    onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val)) {
                            setLocalSettings({ ...localSettings, gridSubLineOpacity: val });
                            debouncedUpdateBoard({ gridSubLineOpacity: val });
                        }
                    }}
                    min={0}
                    max={1}
                    step={0.01}
                    style={{
                        maxWidth: '4rem',
                        fontSize: '12px',
                        padding: '0.25rem',
                    }}
                />
            </Dropdown.Item>
            <hr />
            <Dropdown.Item
                onClick={(e) => {
                    dispatch(updateBoard({ ...board, showItems: !board?.showItems }));
                }}
            >
                Show All Items
                <Form.Check className='ms-auto' type='switch' id='showItems' checked={board.showItems} readOnly />
            </Dropdown.Item>
            <hr />
            <Dropdown.Item>
                Theme
                <DropdownButton className='ms-auto' variant='secondary' title={theme}>
                    <Dropdown.Item
                        onClick={(e) => {
                            setTheme('system');
                        }}
                    >
                        System
                    </Dropdown.Item>
                    <Dropdown.Item
                        onClick={(e) => {
                            setTheme('light');
                        }}
                    >
                        Light
                    </Dropdown.Item>
                    <Dropdown.Item
                        onClick={(e) => {
                            setTheme('dark');
                        }}
                    >
                        Dark
                    </Dropdown.Item>
                </DropdownButton>
            </Dropdown.Item>
            <Dropdown.Item>
                <ColorPicker
                    label='Background Color'
                    value={localSettings.backgroundColor}
                    onChange={(e) => {
                        setLocalSettings({ ...localSettings, backgroundColor: e });
                        debouncedUpdateBoard({ backgroundColor: e });
                    }}
                />
            </Dropdown.Item>
            <Dropdown.Item
                onClick={async (e) => {
                    const confirmed = await requestConfirmation(
                        'Are you sure you want to reset all preferences to default? This cant be undone.',
                    );
                    if (confirmed) {
                        dispatch(
                            updateBoard({
                                ...DEFAULT_BOARD,
                                id: board.id,
                                name: board.name,
                                gridLineColor: undefined,
                                gridSubLineColor: undefined,
                                backgroundColor: undefined,
                            }),
                        );

                        setLocalSettings({
                            ...DEFAULT_BOARD,
                            gridLineColor: '#808080',
                            gridSubLineColor: '#808080',
                            backgroundColor: isDark ? '#121212' : '#ffffff',
                        });
                    }
                }}
            >
                Reset Preferences
            </Dropdown.Item>
        </DropdownButton>
    );
};

export default NavbarPreferencesDropdown;
