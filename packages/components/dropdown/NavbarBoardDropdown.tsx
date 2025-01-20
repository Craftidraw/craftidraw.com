import { Dropdown, DropdownButton } from 'react-bootstrap';
import type { RootState } from '~/lib/store/store';
import React from 'react';
import {
    selectItemById,
    setBoard,
    setHistory,
    setHistoryIndex,
    setIsCustomExportsOpen,
    setIsCustomTooltipsOpen,
    setIsLibraryOpen,
} from '~/lib/store/features/appSlice';
import { useAppDispatch, useAppSelector } from '~/lib/store/hooks';
import { useConfirmation } from '~/providers/ConfirmationProvider';
import createCUID from '~/lib/cuid/createCUID';
import type { Board } from '~/types/board';
import type { HistoryAction } from '~/types/history';
import { useFileOperations } from '~/hooks/useFileOperations';
import { DEFAULT_BOARD } from '~/utils/defaults';

interface NavbarBoardDropdownProps {
    isLocal: boolean;
}

const NavbarBoardDropdown = ({ isLocal }: NavbarBoardDropdownProps) => {
    const dispatch = useAppDispatch();
    const { requestConfirmation } = useConfirmation();
    const { exportBoard, importBoard, saveItemToLibrary, importImage, exportItem, importItem, customExportItem } =
        useFileOperations();

    const selectedItem = useAppSelector((state: RootState) => state.app.selectedItem);
    const currentItem = useAppSelector((state: RootState) => selectItemById(state, selectedItem ?? ''));

    const handleWipe = async () => {
        const confirm = await requestConfirmation(
            'Are you sure that you want to wipe your board? This will reset the board data and item data. This cannot be undone.',
        );
        if (!confirm) return;

        const board: Board = {
            ...structuredClone(DEFAULT_BOARD),
            id: createCUID(),
        };

        localStorage.setItem('board', JSON.stringify(board));
        localStorage.setItem('items', JSON.stringify('[]'));
        dispatch(setBoard({ board: board, items: [] }));
        dispatch(setHistory([] as HistoryAction[]));
        dispatch(setHistoryIndex(-1));
    };

    return (
        <DropdownButton variant='empty' title='Board'>
            <Dropdown.Item
                onClick={async (e) => {
                    e.preventDefault();
                    await importBoard();
                }}
            >
                <i className='fa-solid fa-folder-open'></i>
                Open Board
                <div className='keybind ms-auto'>Ctrl + O</div>
            </Dropdown.Item>
            <Dropdown.Item
                onClick={async (e) => {
                    e.preventDefault();
                    await exportBoard();
                }}
            >
                <i className='fa-solid fa-download'></i>
                Export Board
                <div className='keybind ms-auto'>Ctrl + S</div>
            </Dropdown.Item>
            {!isLocal && (
                <Dropdown.Item>
                    <i className='fa-solid fa-layer-group'></i>
                    Add to Collection
                </Dropdown.Item>
            )}
            <hr />
            <Dropdown.Item
                onClick={async (e) => {
                    e.preventDefault();
                    await saveItemToLibrary();
                }}
            >
                <i className='fa-solid fa-floppy-disk'></i>
                Save Item
                <div className='keybind ms-auto'>Ctrl + Alt + S</div>
            </Dropdown.Item>
            <Dropdown.Item
                onClick={async (e) => {
                    e.preventDefault();
                    await exportItem();
                }}
            >
                <i className='fa-solid fa-file-export'></i>
                Export Item
                <div className='keybind ms-auto'>Ctrl + Shift + S</div>
            </Dropdown.Item>
            <Dropdown.Item
                onClick={async (e) => {
                    e.preventDefault();
                    await importItem();
                }}
            >
                <i className='fa-solid fa-file-import'></i>
                Import Item
            </Dropdown.Item>
            <Dropdown.Item
                onClick={async (e) => {
                    e.preventDefault();
                    await importImage();
                }}
            >
                <i className='fa-solid fa-file-import'></i>
                Import Image
            </Dropdown.Item>
            <Dropdown.Item onClick={() => dispatch(setIsLibraryOpen(true))}>
                <i className='fa-solid fa-book'></i>
                Manage Library
            </Dropdown.Item>
            <hr />
            <Dropdown.Item
                onClick={async (e) => {
                    e.preventDefault();
                    if (currentItem) await customExportItem(currentItem);
                }}
            >
                <i className='fa-solid fa-file-export'></i>
                Custom Export Item
            </Dropdown.Item>
            <Dropdown.Item
                onClick={async (e) => {
                    e.preventDefault();
                    dispatch(setIsCustomTooltipsOpen(true));
                }}
            >
                <i className='fa-solid fa-gear'></i>
                Configure Tooltips
            </Dropdown.Item>
            <Dropdown.Item
                onClick={async (e) => {
                    e.preventDefault();
                    dispatch(setIsCustomExportsOpen(true));
                }}
            >
                <i className='fa-solid fa-gear'></i>
                Configure Custom Exports
            </Dropdown.Item>
            <hr />
            <Dropdown.Item disabled={true}>
                <i className='fa-solid fa-share'></i>
                Share
            </Dropdown.Item>
            {!isLocal && (
                <Dropdown.Item disabled={true}>
                    <i className='fa-solid fa-person-circle-plus'></i>
                    Invite to Board
                </Dropdown.Item>
            )}
            <hr />
            <Dropdown.Item
                onClick={async (e) => {
                    e.preventDefault();
                    await handleWipe();
                }}
            >
                <i className='fa-solid fa-recycle'></i>
                Wipe Board
            </Dropdown.Item>
        </DropdownButton>
    );
};

export default NavbarBoardDropdown;
