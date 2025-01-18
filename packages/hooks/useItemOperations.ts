import {
    addItem,
    addItems,
    addToHistory,
    deleteItem as deleteLocalItem,
    deleteItems,
    setCopiedItem,
    setHistoryIndex,
    setItems,
    setSelectedItem,
    selectAllItems,
    selectItemById,
} from '~/lib/store/features/appSlice';
import type { Item } from '~/types/item';
import createCUID from '~/lib/cuid/createCUID';
import type { HistoryAction } from '~/types/history';
import { useCallback } from 'react';
import { useItem } from './useItem';
import { useAppSelector } from '~/lib/store/hooks';
import { useStorage } from '~/providers/StorageProvider';
import { type RootState } from '~/lib/store/store';
import { useAppDispatch } from '~/lib/store/hooks';

export const useItemOperations = () => {
    const dispatch = useAppDispatch();
    const { type, markForDeletion, unmarkForDeletion } = useStorage();
    const { handleItemSave } = useItem();
    const copiedItem = useAppSelector((state: RootState) => state.app.copiedItem);
    const selectedItem = useAppSelector((state: RootState) => state.app.selectedItem);
    const currentItem = useAppSelector((state: RootState) => selectItemById(state, selectedItem ?? ''));
    const items = useAppSelector(selectAllItems);
    const history = useAppSelector((state: RootState) => state.app.history);

    async function remove() {
        if (!selectedItem || !currentItem) return;
        dispatch(
            addToHistory({
                type: 'delete',
                previousSnapshots: [currentItem] as Item[],
            }),
        );
        if (type === 'cloud') markForDeletion(currentItem.id);
        dispatch(deleteLocalItem(currentItem.id));
        dispatch(setSelectedItem(null));
        handleItemSave(items.filter((item) => item.id !== currentItem.id));
    }

    function copy() {
        if (!currentItem) return;
        dispatch(setCopiedItem(currentItem));
    }

    async function cut() {
        if (!currentItem) return;
        dispatch(setCopiedItem(currentItem));
        if (type === 'cloud') markForDeletion(currentItem.id);
        dispatch(deleteLocalItem(currentItem.id));
        dispatch(setSelectedItem(null));
        handleItemSave(items.filter((item) => item.id !== currentItem.id));
    }

    function paste() {
        if (!copiedItem) return;
        const newItem = { ...copiedItem, id: createCUID(), attachments: [] };
        dispatch(addItem(newItem));
        dispatch(setSelectedItem(newItem.id));
        dispatch(
            addToHistory({
                type: 'create',
                currentSnapshots: [{ ...newItem }],
            } as HistoryAction),
        );
        handleItemSave([...items, newItem]);
    }

    const processUndoItems = useCallback(
        async (
            snapshots: Item[],
            actionType: 'create' | 'update' | 'delete',
            currentItems: Item[],
        ): Promise<Item[]> => {
            let updatedItems = [...currentItems];

            switch (actionType) {
                case 'create':
                    if (type === 'cloud') {
                        snapshots.forEach((item) => markForDeletion(item.id));
                    }
                    const createItemIds = snapshots.map((item) => item.id);
                    updatedItems = updatedItems.filter((item) => !createItemIds.includes(item.id));
                    dispatch(deleteItems(createItemIds));
                    break;

                case 'update':
                    updatedItems = updatedItems.map((item) => {
                        const snapshot = snapshots.find((s) => s.id === item.id);
                        return snapshot ?? item;
                    });
                    dispatch(setItems(updatedItems));
                    break;

                case 'delete':
                    if (type === 'cloud') {
                        snapshots.forEach((item) => unmarkForDeletion(item.id));
                    }
                    updatedItems = [...updatedItems, ...snapshots];
                    dispatch(addItems(snapshots));
                    break;
            }

            return updatedItems;
        },
        [dispatch, markForDeletion, type, unmarkForDeletion],
    );

    const processRedoAction = useCallback(
        async (
            snapshots: Item[],
            actionType: 'create' | 'update' | 'delete',
            currentItems: Item[],
        ): Promise<Item[]> => {
            let updatedItems = [...currentItems];

            switch (actionType) {
                case 'create':
                    if (type === 'cloud') {
                        snapshots.forEach((item) => unmarkForDeletion(item.id));
                    }
                    updatedItems = [...updatedItems, ...snapshots];
                    dispatch(addItems(snapshots));
                    break;

                case 'update':
                    updatedItems = updatedItems.map((item) => {
                        const snapshot = snapshots.find((s) => s.id === item.id);
                        return snapshot ?? item;
                    });
                    dispatch(setItems(updatedItems));
                    break;

                case 'delete':
                    if (type === 'cloud') {
                        snapshots.forEach((item) => markForDeletion(item.id));
                    }
                    const itemIds = snapshots.map((item) => item.id);
                    updatedItems = updatedItems.filter((item) => !itemIds.includes(item.id));
                    dispatch(deleteItems(itemIds));
                    break;
            }

            return updatedItems;
        },
        [dispatch, markForDeletion, type, unmarkForDeletion],
    );

    const undo = useCallback(async () => {
        if (history.index < 0) return;

        const action = history.actions[history.index];
        if (!action) return;

        const snapshots = action.type === 'create' ? action.currentSnapshots : action.previousSnapshots;
        if (!snapshots?.length) return;

        const updatedItems = await processUndoItems(snapshots, action.type, items);

        dispatch(setHistoryIndex(history.index - 1));
        handleItemSave(updatedItems);
    }, [history.index, history.actions, processUndoItems, items, dispatch, handleItemSave]);

    const redo = useCallback(async () => {
        if (history.index >= history.actions.length - 1) return;

        const nextIndex = history.index + 1;
        const action = history.actions[nextIndex];
        if (!action) return;

        const snapshots = action.type === 'delete' ? action.previousSnapshots : action.currentSnapshots;
        if (!snapshots?.length) return;

        const updatedItems = await processRedoAction(snapshots, action.type, items);

        dispatch(setHistoryIndex(nextIndex));
        handleItemSave(updatedItems);
    }, [history.index, history.actions, processRedoAction, items, dispatch, handleItemSave]);

    return {
        cut,
        copy,
        paste,
        remove,
        undo,
        redo,
    };
};
