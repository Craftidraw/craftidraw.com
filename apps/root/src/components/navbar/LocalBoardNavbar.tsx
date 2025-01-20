'use client';

import { Button, Form, InputGroup, Navbar } from 'react-bootstrap';
import type { RootState } from '~/lib/store/store';
import React, { useCallback, useState } from 'react';
import { debounce } from 'lodash';
import type { Board } from '~/types/board';
import { setIsSaved, updateBoard } from '~/lib/store/features/appSlice';
import { useAppDispatch, useAppSelector } from '~/lib/store/hooks';
import { useShortcut } from '~/hooks/useShortcut';
import NavbarBoardDropdown from '~/components/dropdown/NavbarBoardDropdown';
import NavbarEditDropdown from '~/components/dropdown/NavbarEditDropdown';
import NavbarHelpDropdown from '~/components/dropdown/NavbarHelpDropdown';
import NavbarPreferencesDropdown from '~/components/dropdown/NavbarPreferencesDropdown';
import BoardToolbar from '~/components/ui/BoardToolbar';
import { useFileOperations } from '~/hooks/useFileOperations';
import { useStorage } from '~/providers/StorageProvider';

const LocalBoardNavbar = () => {
    const dispatch = useAppDispatch();
    const { useKeyPress } = useShortcut();
    const { exportBoard, importBoard, saveItemToLibrary, exportItem } = useFileOperations();
    const { requestBoardSave } = useStorage();

    const board: Board | null = useAppSelector((state: RootState) => state.app.board);
    const isSaved = useAppSelector((state: RootState) => state.app.isSaved);

    const [boardName, setBoardName] = useState<string>(board?.name || '');

    const debounceTyping = useCallback(
        debounce((text: string) => {
            dispatch(setIsSaved('pending'));
            dispatch(updateBoard({ ...board, name: text }));
            requestBoardSave({ ...board, name: text }, (success) => {
                if (!success) {
                    console.error('Failed to save board');
                    dispatch(setIsSaved('failure'));
                } else {
                    dispatch(setIsSaved('saved'));
                }
            });
        }, 500),
        [board, dispatch, requestBoardSave],
    );

    const handleBoardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBoardName(e.target.value);
        debounceTyping(e.target.value);
    };

    useKeyPress('o', (event) => {
        if (event.ctrlKey || event.metaKey) {
            void importBoard();
        }
    });

    useKeyPress('s', (event) => {
        if ((event.ctrlKey || event.metaKey) && !event.shiftKey && !event.altKey) {
            void exportBoard();
        } else if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
            void exportItem();
        } else if ((event.ctrlKey || event.metaKey) && event.altKey) {
            void saveItemToLibrary();
        }
    });

    return (
        <Navbar id='board-navbar-container' expand='lg'>
            <div className='d-flex' style={{ flexDirection: 'row', width: '100%' }}>
                <div className='board-info-wrapper'>
                    <div className='board-info-container'>
                        <div className='d-flex flex-row'>
                            <InputGroup style={{ paddingLeft: '5px' }}>
                                <Form.Control
                                    id='nav-board-input'
                                    placeholder={'Board Name'}
                                    value={boardName}
                                    onChange={handleBoardNameChange}
                                />
                            </InputGroup>
                            <div className='align-self-center'>
                                {isSaved === 'saved' ? (
                                    <small title='Changes are saved.' style={{ color: '#50B498' }}>
                                        <i className='fa-solid fa-check'></i>
                                    </small>
                                ) : isSaved === 'failure' ? (
                                    <small title='Changes were not saved.' style={{ color: 'red' }}>
                                        <i className='fa-solid'></i>
                                    </small>
                                ) : isSaved === 'pending' ? (
                                    <small title='Changes are being saved.' style={{ color: 'grey' }}>
                                        <i className='fa-solid fa-check'></i>
                                    </small>
                                ) : (
                                    <small title='Changes are not saved.' style={{ color: 'grey' }}>
                                        <i className='fa-solid fa-check'></i>
                                    </small>
                                )}
                            </div>
                        </div>
                        <div className='d-flex flex-row'>
                            <NavbarBoardDropdown isLocal={true} />
                            <NavbarEditDropdown />
                            <NavbarHelpDropdown />
                            <NavbarPreferencesDropdown />
                        </div>
                    </div>
                </div>
                <div className='d-flex tools-wrapper'>
                    <BoardToolbar />
                </div>
                <div className='d-flex ms-auto' style={{ marginLeft: '15px' }}>
                    <div style={{ alignSelf: 'center' }}>
                        <Button variant='primary' disabled>
                            Share
                        </Button>
                    </div>
                </div>
            </div>
        </Navbar>
    );
};

export default LocalBoardNavbar;
