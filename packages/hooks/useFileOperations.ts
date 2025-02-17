import { saveCustomFile, uploadCustomFile, uploadFile } from '~/utils/file';
import { addNotification, selectAllItems, selectItemById, setBoard } from '~/lib/store/features/appSlice';
import createCUID from '~/lib/cuid/createCUID';
import { fixItem, validateItem } from '~/lib/validate/validateItem';
import type { CustomItem, Item, TooltipLine } from '~/types/item';
import type { LibraryExportConfiguration, LibraryTooltipConfiguration } from '~/types/library';
import { useAppDispatch } from '~/lib/store/hooks';
import { type RootState } from '~/lib/store/store';
import { useAppSelector } from '~/lib/store/hooks';
import { useConfirmation } from '~/providers/ConfirmationProvider';
import { useIndexedDB } from './useIndexedDB';

export const useFileOperations = () => {
    const dispatch = useAppDispatch();
    const board = useAppSelector((state: RootState) => state.app.board);
    const items = useAppSelector(selectAllItems);
    const selectedItem = useAppSelector((state: RootState) => state.app.selectedItem);
    const currentItem = useAppSelector((state: RootState) => selectItemById(state, selectedItem ?? ''));
    const selectedExportConfiguration = useAppSelector((state: RootState) => state.app.selectedConfiguration);
    const {
        saveImage,
        saveItem,
        validateImageFile,
        validateImageFileSize,
        saveExportConfiguration,
        saveTooltipConfiguration,
        getExportConfiguration,
    } = useIndexedDB();
    const { requestConfirmation } = useConfirmation();

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
                    required: false,
                }),
            );

        } catch (err) {
            console.error(err);
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'error',
                    title: 'Export Failed',
                    message: 'Board failed to export.',
                    required: false,
                }),
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
                    required: false,
                }),
            );
        } catch (err) {
            console.error('Import Error:', err);

            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'error',
                    title: 'Import Failed',
                    message: 'Board import failed. Please try again.',
                    required: false,
                }),
            );
        }
    }


    async function saveItemToLibrary() {
        if (!currentItem) {
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'warning',
                    title: 'No Item Selected',
                    message: 'Please select an item to save.',
                    required: false,
                }),
            );
            return;
        }

        await saveItem(currentItem)
            .then(() => {
                dispatch(
                    addNotification({
                        id: createCUID(),
                        type: 'success',
                        title: 'Item Saved',
                        message: 'Item successfully saved.',
                        required: false,
                    }),
                );
            })

            .catch(() => {
                dispatch(
                    addNotification({
                        id: createCUID(),
                        type: 'error',
                        title: 'Save Failed',
                        message: 'Failed to save the item. Please try again.',
                        required: false,
                    }),
                );
            });

    }

    async function exportItem() {
        if (!currentItem) {
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'warning',
                    title: 'No Item Selected',
                    message: 'Please select an item to export.',
                    required: false,
                }),
            );
            return;

        }
        try {
            const data = JSON.stringify(currentItem);
            await saveCustomFile('Craftidraw Item', data, 'application/board', '.cditem');
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'success',
                    title: 'Export Complete',
                    message: 'Item successfully exported.',
                    required: false,
                }),
            );

        } catch (err) {
            console.error(err);
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'error',
                    title: 'Export Failed',
                    message: 'Item failed to export.',
                    required: false,
                }),
            );
        }

    }

    async function importItem() {
        try {
            const file = await uploadCustomFile('application/board', '.cditem');
            const text = await file.text();
            let item = JSON.parse(text);

            if (!validateItem(text as string).status) {
                const fixedItem = fixItem(text as string);
                if (fixedItem) {
                    item = fixedItem;
                } else {
                    throw new Error('Failed to fix item');
                }
            }
            await saveItem(item as Item);

            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'success',
                    title: 'Import Complete',
                    message: 'Item successfully imported.',
                    required: false,
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
                    required: false,
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
                        required: false,
                    }),
                );
            } else {
                dispatch(
                    addNotification({
                        id: createCUID(),
                        type: 'warning',
                        title: 'Invalid File',
                        message: 'Please make sure the file is a valid image and is under 5MB.',
                        required: false,
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
                    required: false,
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
                    required: false,
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
                    required: false,
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
                    required: false,
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
                    required: false,
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
                    required: false,
                }),
            );
        }
    }

    async function saveTooltipConfigurationToLibrary(configuration: LibraryTooltipConfiguration) {
        try {
            await saveTooltipConfiguration(configuration.settings, configuration.name);
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'success',
                    title: 'Configuration Saved',
                    message: 'Configuration saved successfully.',
                    required: false,
                }),
            );
        } catch (err) {
            console.error(err);
        }
    }

    async function exportTooltipConfiguration(configuration: LibraryTooltipConfiguration) {
        const fileName = `${configuration.name}.cdtooltip`;
        const fileContents = JSON.stringify(configuration.settings);

        try {
            await saveCustomFile(fileName, fileContents, 'application/tooltip', '.cdtooltip');

            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'success',
                    title: 'Export Complete',
                    message: 'Tooltip configuration successfully exported.',
                    required: false,
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
                    required: false,
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

            await saveTooltipConfiguration(configuration.settings, configuration.name);

            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'success',
                    title: 'Configuration Saved',
                    message: 'Configuration saved successfully.',
                    required: false,
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
                    required: false,
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
                    required: false,
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
                    required: false,
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
                    required: false,
                }),
            );
        }
    }

    return {
        exportBoard,
        importBoard,
        saveItemToLibrary,
        exportItem,
        importItem,
        importImage,
        importExportConfiguration,
        exportExportConfiguration,
        saveExportConfigurationToLibrary,
        saveTooltipConfigurationToLibrary,
        exportTooltipConfiguration,
        importTooltipConfiguration,
        getAppropriateList,
        customExportItem,
        getLoreLine,
    };
};
