import { useCallback, useEffect } from 'react';
import type { RootState } from '~/lib/store/store';
import { useConfirmation } from '~/providers/ConfirmationProvider';
import type { LibraryExportConfiguration, LibraryTooltipConfiguration } from '~/types/library';
import { saveCustomFile, uploadCustomFile, uploadFile } from '~/utils/fileUtil';
import type { HistoryAction } from '~/types/history';
import type { Notification } from '~/types/notification';
import type { TooltipLine, Item, CustomItem } from '~/types/item';
import { useAppDispatch, useAppSelector } from '~/lib/store/hooks';
import {
    addToHistory,
    selectAllItems,
    setPreviousTool,
    setSelectedTool,
    deleteItem as deleteLocalItem,
    setSelectedItem,
    setCopiedItem,
    addItem,
    setHistoryIndex,
    setItem,
    addNotification,
    setBoard,
    setIsSaved,
} from '~/lib/store/features/appSlice';
import { useIndexedDB } from '~/hooks/useIndexedDB';
import createCUID from '~/lib/cuid/createCUID';
import { useStorage } from '~/providers/StorageProvider';

export function useShortcut() {
    const dispatch = useAppDispatch();
    const {
        saveImage,
        saveItem,
        validateImageFile,
        validateImageFileSize,
        saveExportConfiguration,
        saveTooltipConfiguration,
        getExportConfiguration,
    } = useIndexedDB();
    const { type, requestItemSave, markForDeletion, unmarkForDeletion } = useStorage();
    const { requestConfirmation } = useConfirmation();

    const board = useAppSelector((state: RootState) => state.app.board);
    const items = useAppSelector(selectAllItems);
    const selectedItem = useAppSelector((state: RootState) => state.app.selectedItem);
    const copiedItem = useAppSelector((state: RootState) => state.app.copiedItem);
    const history = useAppSelector((state: RootState) => state.app.history);
    const selectedTool = useAppSelector((state: RootState) => state.app.selectedTool);
    const previousTool = useAppSelector((state: RootState) => state.app.previousTool);
    const selectedExportConfiguration = useAppSelector((state: RootState) => state.app.selectedConfiguration);

    function useKeyPress(targetKey: string, handler: (event: KeyboardEvent) => void) {
        useEffect(() => {
            const keyHandler = (event: KeyboardEvent) => {
                const activeElement = document.activeElement;
                if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                    return;
                }

                event.preventDefault();
                if (event.key.toLowerCase() === targetKey.toLowerCase()) {
                    handler(event);
                }
            };

            window.addEventListener('keydown', keyHandler);
            return () => {
                window.removeEventListener('keydown', keyHandler);
            };
        }, [targetKey, handler]);
    }

    function useKeyRelease(targetKey: string, handler: (event: KeyboardEvent) => void) {
        useEffect(() => {
            const keyHandler = (event: KeyboardEvent) => {
                const activeElement = document.activeElement;
                if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                    return;
                }

                event.preventDefault();
                if (event.key.toLowerCase() === targetKey.toLowerCase()) {
                    handler(event);
                }
            };

            window.addEventListener('keyup', keyHandler);
            return () => {
                window.removeEventListener('keyup', keyHandler);
            };
        }, [targetKey, handler]);
    }

    const handleItemChange = useCallback(() => {
        dispatch(setIsSaved('pending'));

        requestItemSave(items, (success: boolean) => {
            if (success) {
                dispatch(setIsSaved('saved'));
            } else {
                console.error('Failed to save items');
                dispatch(setIsSaved('failure'));
            }
        });
    }, [items, dispatch]);

    // Tool

    function quickMoveDown() {
        dispatch(setPreviousTool(selectedTool));
        dispatch(setSelectedTool('move'));
    }

    function quickMoveUp() {
        if (!previousTool) return;
        dispatch(setSelectedTool(previousTool));
        dispatch(setPreviousTool(null));
    }

    // Edit

    async function remove() {
        if (!selectedItem) return;
        dispatch(
            addToHistory({
                type: 'delete',
                previousSnapshot: selectedItem,
            }),
        );
        if (type === 'cloud') markForDeletion(selectedItem.id);
        dispatch(deleteLocalItem(selectedItem.id));
        dispatch(setSelectedItem(null));
        handleItemChange();
    }

    function copy() {
        if (!selectedItem) return;
        dispatch(setCopiedItem(selectedItem));
    }

    async function cut() {
        if (!selectedItem) return;
        dispatch(setCopiedItem(selectedItem));
        if (type === 'cloud') markForDeletion(selectedItem.id);
        dispatch(deleteLocalItem(selectedItem.id));
        dispatch(setSelectedItem(null));
        handleItemChange();
    }

    function paste() {
        if (!copiedItem) return;
        const newItem = { ...copiedItem, id: createCUID(), attachments: [] };
        dispatch(addItem(newItem));
        dispatch(setSelectedItem(newItem));
        dispatch(
            addToHistory({
                type: 'create',
                currentSnapshot: { ...newItem },
            } as HistoryAction),
        );
    }

    async function undo() {
        if (history.index >= 0) {
            const action = history.actions[history.index];
            if (!action) return;
            if (action.type === 'create') {
                if (!action.currentSnapshot) return;
                if (type === 'cloud') markForDeletion(action.currentSnapshot.id);
                dispatch(deleteLocalItem(action.currentSnapshot.id));
            } else if (action.type === 'update') {
                if (!action.previousSnapshot) return;
                dispatch(setItem(action.previousSnapshot));
                dispatch(setSelectedItem(action.previousSnapshot));
            } else if (action.type === 'delete') {
                if (!action.previousSnapshot) return;
                if (type === 'cloud') unmarkForDeletion(action.previousSnapshot.id);
                dispatch(addItem(action.previousSnapshot));
                dispatch(setSelectedItem(action.previousSnapshot));
            }
            dispatch(setHistoryIndex(history.index - 1));
            handleItemChange();
        }
    }

    async function redo() {
        if (history.index < history.actions.length - 1) {
            const nextIndex = history.index + 1;
            const action = history.actions[nextIndex];
            if (!action) return;
            if (action.type === 'create') {
                if (!action.currentSnapshot) return;
                if (type === 'cloud') unmarkForDeletion(action.currentSnapshot.id);
                dispatch(addItem(action.currentSnapshot));
                dispatch(setSelectedItem(action.currentSnapshot));
            } else if (action.type === 'update') {
                if (!action.currentSnapshot) return;
                dispatch(setItem(action.currentSnapshot));
                dispatch(setSelectedItem(action.currentSnapshot));
            } else if (action.type === 'delete') {
                if (!action.previousSnapshot) return;
                if (type === 'cloud') markForDeletion(action.previousSnapshot.id);
                dispatch(deleteLocalItem(action.previousSnapshot.id));
            }
            dispatch(setHistoryIndex(nextIndex));
            handleItemChange();
        }
    }

    // File

    async function exportBoard() {
        try {
            const output = {
                version: '0.1.0',
                boardState: board,
                items: items,
            };
            const data = JSON.stringify(output);
            await saveCustomFile(board?.name || 'Craftidraw Board', data, 'application/board', '.cdboard');
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'success',
                    title: 'Export Complete',
                    message: 'Board successfully exported.',
                } as Notification),
            );
        } catch (err) {
            console.error(err);
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'error',
                    title: 'Export Failed',
                    message: 'Board failed to export.',
                } as Notification),
            );
        }
    }

    async function importBoard() {
        try {
            const file = await uploadCustomFile('application/board', '.cdboard');
            const text = await file.text();
            const input = JSON.parse(text);

            const confirmed = await requestConfirmation(
                'Are you sure you want to import this board? If you have a Craftium membership, your old board will be saved. If not, please backup your board.',
            );
            if (!confirmed) return;

            const board = {
                ...input.boardState,
                id: createCUID(),
            };
            if (input.items) {
                for (const item of input.items) {
                    item.id = createCUID();
                }
            }

            dispatch(
                setBoard({
                    board,
                    items: input.items,
                }),
            );

            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'success',
                    title: 'Import Complete',
                    message: 'Board successfully imported.',
                } as Notification),
            );
        } catch (err) {
            console.error('Import Error:', err);
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'error',
                    title: 'Import Failed',
                    message: 'Board import failed. Please try again.',
                } as Notification),
            );
        }
    }

    async function saveItemToLibrary() {
        if (!selectedItem) {
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'warning',
                    title: 'No Item Selected',
                    message: 'Please select an item to save.',
                } as Notification),
            );
            return;
        }
        await saveItem(selectedItem)
            .then(() => {
                dispatch(
                    addNotification({
                        id: createCUID(),
                        type: 'success',
                        title: 'Item Saved',
                        message: 'Item successfully saved.',
                    } as Notification),
                );
            })
            .catch(() => {
                dispatch(
                    addNotification({
                        id: createCUID(),
                        type: 'error',
                        title: 'Save Failed',
                        message: 'Failed to save the item. Please try again.',
                    } as Notification),
                );
            });
    }

    async function exportItem() {
        if (!selectedItem) {
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'warning',
                    title: 'No Item Selected',
                    message: 'Please select an item to export.',
                } as Notification),
            );
            return;
        }
        try {
            const data = JSON.stringify(selectedItem);
            await saveCustomFile('Craftidraw Item', data, 'application/board', '.cditem');
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'success',
                    title: 'Export Complete',
                    message: 'Item successfully exported.',
                } as Notification),
            );
        } catch (err) {
            console.error(err);
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'error',
                    title: 'Export Failed',
                    message: 'Item failed to export.',
                } as Notification),
            );
        }
    }

    async function importItem() {
        try {
            const file = await uploadCustomFile('application/board', '.cditem');
            const text = await file.text();
            const item = JSON.parse(text);

            await saveItem(item);

            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'success',
                    title: 'Import Complete',
                    message: 'Item successfully imported.',
                }),
            );
        } catch (err) {
            console.error('Import Error:', err);
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'error',
                    title: 'Import Failed',
                    message: 'Item import failed. Please try again.',
                }),
            );
        }
    }

    async function importImage() {
        try {
            const file = await uploadFile(['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/gif']);
            if (validateImageFile(file) && validateImageFileSize(file)) {
                await saveImage(file);
                dispatch(
                    addNotification({
                        id: createCUID(),
                        type: 'success',
                        title: 'Image Saved',
                        message: 'Image saved successfully.',
                    }),
                );
            } else {
                dispatch(
                    addNotification({
                        id: createCUID(),
                        type: 'warning',
                        title: 'Invalid File',
                        message: 'Please make sure the file is a valid image and is under 5MB.',
                    }),
                );
            }
        } catch (err) {
            console.error('Image Upload Error:', err);
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'error',
                    title: 'Upload Failed',
                    message: 'Image failed to upload.',
                }),
            );
        }
    }

    async function importExportConfiguration() {
        try {
            const file = await uploadCustomFile('application/export', '.cdexport');
            await saveExportConfiguration(file);
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'success',
                    title: 'Configuration Saved',
                    message: 'Configuration saved successfully.',
                }),
            );
        } catch (err) {
            console.error(err);
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'error',
                    title: 'Configuration Failed',
                    message: 'Configuration failed to save.',
                }),
            );
        }
    }

    async function saveExportConfigurationToLibrary(configuration: LibraryExportConfiguration) {
        try {
            await saveExportConfiguration(configuration.file);
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'success',
                    title: 'Configuration Saved',
                    message: 'Configuration saved successfully.',
                }),
            );
        } catch (err) {
            console.error(err);
        }
    }

    async function exportExportConfiguration(configuration: LibraryExportConfiguration) {
        try {
            await saveCustomFile(
                configuration.file.name,
                await configuration.file.text(),
                'application/export',
                '.cdexport',
            );

            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'success',
                    title: 'Export Complete',
                    message: 'Configuration successfully exported.',
                }),
            );
        } catch (err) {
            console.error('Export Error:', err);
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'error',
                    title: 'Export Failed',
                    message: 'Configuration export failed. Please try again.',
                }),
            );
        }
    }

    async function saveTooltipConfigurationToLibrary(configuration: LibraryTooltipConfiguration) {
        try {
            await saveTooltipConfiguration(configuration.tooltip, configuration.name);
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'success',
                    title: 'Configuration Saved',
                    message: 'Configuration saved successfully.',
                }),
            );
        } catch (err) {
            console.error(err);
        }
    }

    async function exportTooltipConfiguration(configuration: LibraryTooltipConfiguration) {
        const fileName = `${configuration.name}.cdtooltip`;
        const fileContents = JSON.stringify(configuration.tooltip);

        try {
            await saveCustomFile(fileName, fileContents, 'application/tooltip', '.cdtooltip');

            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'success',
                    title: 'Export Complete',
                    message: 'Tooltip configuration successfully exported.',
                }),
            );
        } catch (err) {
            console.error('Export Error:', err);
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'error',
                    title: 'Export Failed',
                    message: 'Tooltip configuration export failed. Please try again.',
                }),
            );
        }
    }

    async function importTooltipConfiguration() {
        try {
            // Use cross-browser compatible file upload function
            const file = await uploadCustomFile('application/tooltip', '.cdtooltip');
            const text = await file.text();
            const configuration = JSON.parse(text);

            await saveTooltipConfiguration(configuration, file.name);

            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'success',
                    title: 'Configuration Saved',
                    message: 'Configuration saved successfully.',
                }),
            );
        } catch (err) {
            console.error('Import Error:', err);
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'error',
                    title: 'Import Failed',
                    message: 'Configuration import failed. Please try again.',
                }),
            );
        }
    }

    function getLoreLine(lines: TooltipLine[] | undefined, index: number): string {
        if (!lines || !Array.isArray(lines) || index < 1) {
            return '';
        }
        const line = lines[index - 1];
        return line?.text ?? '';
    }

    async function getAppropriateList(lore: TooltipLine[]) {
        if (!selectedExportConfiguration) return '';
        const configuration = await getExportConfiguration(selectedExportConfiguration);
        const fileExtension = configuration.file.name.split('.').pop();

        if (fileExtension === 'yml' || fileExtension === 'yaml') {
            return '\n' + lore.map((line) => `    - "${line.text}"`).join('\n');
        } else if (fileExtension === 'json') {
            return '\n' + lore.map((line) => `      { "text": ${JSON.stringify(line.text)} }`).join(',\n');
        } else {
            return lore.map((line) => `"${line.text}"`).join(', ');
        }
    }

    async function customExportItem(item: Item) {
        if (item.type !== 'custom') return;

        if (!selectedExportConfiguration) {
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'error',
                    title: 'Export Failed',
                    message: 'Please set an export configuration. You can do this in the export configuration menu.',
                }),
            );
            return;
        }

        try {
            const configuration = await getExportConfiguration(selectedExportConfiguration);
            const fileContent = await configuration.file.text(); // Await the text content

            // Apply replacements
            let updatedFileContent = fileContent
                .replace('%item_display_name%', (item as CustomItem).displayName?.text ?? '')
                .replace('%item_entity%', (item as CustomItem).entity ?? '')
                .replace('%item_lore_all%', (await getAppropriateList((item as CustomItem).lore ?? [])) ?? '');

            const loreRegex = /%item_lore_(\d+)%/g;
            updatedFileContent = updatedFileContent.replace(loreRegex, (match: any, index: string) => {
                const loreIndex = parseInt(index, 10);
                return getLoreLine((item as CustomItem).lore ?? [], loreIndex) ?? '';
            });

            const fileName = `${(item as CustomItem).entity || 'Craftidraw_Item'}_${configuration.file.name}`;
            const fileBlob = new Blob([updatedFileContent], { type: 'text/plain' });

            await saveCustomFile(fileName, updatedFileContent, 'text/plain', '.txt'); // Adjust the extension as needed

            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'success',
                    title: 'Export Successful',
                    message: 'Item exported successfully.',
                }),
            );
        } catch (err) {
            console.error('Export Error:', err);
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'error',
                    title: 'Export Failed',
                    message: 'An error occurred during export. Please try again.',
                }),
            );
        }
    }

    return {
        useKeyPress,
        useKeyRelease,
        quickMoveDown,
        quickMoveUp,
        remove,
        copy,
        cut,
        paste,
        undo,
        redo,
        exportBoard,
        importBoard,
        saveItemToLibrary,
        exportItem,
        importItem,
        importImage,
        importExportConfiguration,
        saveExportConfigurationToLibrary,
        exportExportConfiguration,
        saveTooltipConfigurationToLibrary,
        exportTooltipConfiguration,
        importTooltipConfiguration,
        customExportItem,
    };
}
