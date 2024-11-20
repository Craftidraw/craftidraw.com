import type { Item } from '~/types/item';
import { useEffect } from 'react';
import type { BoardInfo } from '~/types/board';
import { debounce } from 'lodash';

export function useLocalSave() {
    const saveItems = (items: Item[]): boolean => {
        try {
            const itemsToSave = items.map((item) => ({
                ...item,
                position: item.position || { x: 0, y: 0 },
            }));
            localStorage.setItem('items', JSON.stringify(itemsToSave));
            return true;
        } catch (error) {
            console.error('Failed to save items:', error);
            return false;
        }
    };

    const saveBoard = (boardInfo: BoardInfo): boolean => {
        try {
            localStorage.setItem('board', JSON.stringify(boardInfo.board));
            return true;
        } catch {
            return false;
        }
    };

    const debouncedItemSave = debounce((items: Item[], callback: (success: boolean) => void) => {
        const success = saveItems(items);
        callback(success);
    }, 1000);

    const debouncedBoardSave = debounce((boardInfo: BoardInfo, callback: (success: boolean) => void) => {
        const success = saveBoard(boardInfo);
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

    const requestBoardSave = (boardInfo: BoardInfo, callback: (success: boolean) => void) => {
        if (!boardInfo) {
            console.error('Board info is required for saving');
            callback(false);
            return;
        }
        debouncedBoardSave(boardInfo, callback);
    };

    const requestImmediateBoardSave = (boardInfo: BoardInfo, callback: (success: boolean) => void) => {
        if (!boardInfo) {
            console.error('Board info is required for immediate saving');
            callback(false);
            return;
        }
        const success = saveBoard(boardInfo);
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
