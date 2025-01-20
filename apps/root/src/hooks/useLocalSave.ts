import type { Item } from '~/types/item';
import { useEffect } from 'react';
import type { Board } from '~/types/board';
import { debounce } from 'lodash';

export function useLocalSave() {
    const saveItems = (items: Item[]): boolean => {
        try {
            localStorage.setItem('items', JSON.stringify(items));
            return true;
        } catch (error) {
            console.error('Failed to save items:', error);
            return false;
        }
    };

    const saveBoard = (board: Board): boolean => {
        try {
            localStorage.setItem('board', JSON.stringify(board));
            return true;
        } catch {
            return false;
        }
    };

    const debouncedItemSave = debounce((items: Item[], callback: (success: boolean) => void) => {
        const success = saveItems(items);
        callback(success);
    }, 1000);

    const debouncedBoardSave = debounce((board: Board, callback: (success: boolean) => void) => {
        const success = saveBoard(board);
        callback(success);
    }, 1000);

    const requestItemSave = (items: Item[], callback: (success: boolean) => void) => {
        if (!items) {
            console.error('Items are required for saving');
            callback(false);
            return;
        }
        debouncedItemSave(items, callback);
    };

    const requestBoardSave = (board: Board, callback: (success: boolean) => void) => {
        if (!board) {
            console.error('Board is required for saving');
            callback(false);
            return;
        }
        debouncedBoardSave(board, callback);
    };

    const requestImmediateBoardSave = (board: Board, callback: (success: boolean) => void) => {
        if (!board) {
            console.error('Board is required for immediate saving');
            callback(false);
            return;
        }
        const success = saveBoard(board);
        callback(success);
    };

    // Not used but must be defined for the cloud storage provider.
    const markForDeletion = (id: string) => {};
    const unmarkForDeletion = (id: string) => {};

    useEffect(() => {
        return () => {
            debouncedItemSave.cancel();
            debouncedBoardSave.cancel();
        };
    }, []);

    return {
        requestItemSave,
        requestBoardSave,
        requestImmediateBoardSave,
        saveItems,
        saveBoard,
        markForDeletion,
        unmarkForDeletion,
    };
}
