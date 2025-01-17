import { TooltipSettings, type Item, type Tooltip } from '~/types/item';
import {
    type LibraryExportConfiguration,
    type LibraryImage,
    type LibraryItem,
    type LibraryTooltipConfiguration,
} from '~/types/library';

export function useIndexedDB() {
    function openDatabase(dbName: string, storeName: string, version = 1): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
                }
            };

            request.onerror = (event) => {
                reject(event);
            };
        });
    }

    function openImages(): Promise<IDBDatabase> {
        return openDatabase('imageLibrary', 'images');
    }

    function openItems(): Promise<IDBDatabase> {
        return openDatabase('itemLibrary', 'items');
    }

    function openExportConfigurations(): Promise<IDBDatabase> {
        return openDatabase('exportsLibrary', 'exportConfigurations');
    }

    function openTooltipConfigurations(): Promise<IDBDatabase> {
        return openDatabase('tooltipsLibrary', 'tooltipConfigurations');
    }

    async function saveImage(file: File): Promise<void> {
        const base64Image = await getBase64Image(file);
        const db = await openImages();
        const tx = db.transaction('images', 'readwrite');
        const store = tx.objectStore('images');
        const imageInput = {
            name: file.name,
            data: base64Image,
            date: new Date().toISOString(),
            size: file.size,
        };
        store.put(imageInput);
        return await new Promise<void>((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    async function getImages(): Promise<LibraryImage[]> {
        const db = await openImages();
        const tx = db.transaction('images', 'readonly');
        const store = tx.objectStore('images');
        return await new Promise<LibraryImage[]>((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result as LibraryImage[]);
            request.onerror = () => reject(request.error);
        });
    }

    async function getImage(name: string): Promise<any> {
        const db = await openImages();
        const tx = db.transaction('images', 'readonly');
        const store = tx.objectStore('images');
        return await new Promise<any>((resolve, reject) => {
            const request = store.get(name);
            request.onsuccess = () => resolve(request.result as LibraryImage);
            request.onerror = () => reject(request.error);
        });
    }

    async function deleteImage(id: number): Promise<void> {
        const db = await openImages();
        const tx = db.transaction('images', 'readwrite');
        const store = tx.objectStore('images');
        store.delete(id);
        return await new Promise<void>((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    async function saveItem(item: Item): Promise<void> {
        const db = await openItems();
        const tx = db.transaction('items', 'readwrite');
        const store = tx.objectStore('items');
        const itemInput = {
            item: { ...item },
        };
        store.put(itemInput);
        return await new Promise<void>((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    async function getItems(): Promise<LibraryItem[]> {
        const db = await openItems();
        const tx = db.transaction('items', 'readonly');
        const store = tx.objectStore('items');
        return await new Promise<LibraryItem[]>((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result as LibraryItem[]);
            request.onerror = () => reject(request.error);
        });
    }

    async function getItem(uuid: string): Promise<LibraryItem> {
        const db = await openItems();
        const tx = db.transaction('items', 'readonly');
        const store = tx.objectStore('items');
        return await new Promise<LibraryItem>((resolve, reject) => {
            const request = store.get(uuid);
            request.onsuccess = () => resolve(request.result as LibraryItem);
            request.onerror = () => reject(request.error);
        });
    }

    async function deleteItem(id: number): Promise<void> {
        const db = await openItems();
        const tx = db.transaction('items', 'readwrite');
        const store = tx.objectStore('items');
        store.delete(id);
        return await new Promise<void>((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    async function saveExportConfiguration(configuration: File): Promise<void> {
        const db = await openExportConfigurations();
        const tx = db.transaction('exportConfigurations', 'readwrite');
        const store = tx.objectStore('exportConfigurations');
        const configurationInput = {
            file: configuration,
            date: new Date().toISOString(),
        };
        store.put(configurationInput);
        return await new Promise<void>((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    async function getExportConfigurations(): Promise<LibraryExportConfiguration[]> {
        const db = await openExportConfigurations();
        const tx = db.transaction('exportConfigurations', 'readonly');
        const store = tx.objectStore('exportConfigurations');
        return await new Promise<LibraryExportConfiguration[]>((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result as LibraryExportConfiguration[]);
            request.onerror = () => reject(request.error);
        });
    }

    async function getExportConfiguration(id: number): Promise<LibraryExportConfiguration> {
        const db = await openExportConfigurations();
        const tx = db.transaction('exportConfigurations', 'readonly');
        const store = tx.objectStore('exportConfigurations');
        return await new Promise<LibraryExportConfiguration>((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result as LibraryExportConfiguration);
            request.onerror = () => reject(request.error);
        });
    }

    async function deleteExportConfiguration(id: number): Promise<void> {
        const db = await openExportConfigurations();
        const tx = db.transaction('exportConfigurations', 'readwrite');
        const store = tx.objectStore('exportConfigurations');
        store.delete(id);
        return await new Promise<void>((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    async function updateExportConfiguration(
        configuration: LibraryExportConfiguration,
        fileContents: string,
        fileName: string,
    ): Promise<void> {
        const db = await openExportConfigurations();
        const tx = db.transaction('exportConfigurations', 'readwrite');
        const store = tx.objectStore('exportConfigurations');
        const updatedConfig = {
            ...configuration,
            file: new File([fileContents], fileName, { type: 'text/plain' }),
        };
        store.put(updatedConfig);
        return await new Promise<void>((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    async function saveTooltipConfiguration(settings: TooltipSettings, name: string): Promise<void> {
        const db = await openTooltipConfigurations();
        const tx = db.transaction('tooltipConfigurations', 'readwrite');
        const store = tx.objectStore('tooltipConfigurations');
        const tooltipInput = {
            name: name,
            settings: settings,
        };
        store.put(tooltipInput);
        return await new Promise<void>((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    async function getTooltipConfigurations(): Promise<LibraryTooltipConfiguration[]> {
        const db = await openTooltipConfigurations();
        const tx = db.transaction('tooltipConfigurations', 'readonly');
        const store = tx.objectStore('tooltipConfigurations');
        return await new Promise<LibraryTooltipConfiguration[]>((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result as LibraryTooltipConfiguration[]);
            request.onerror = () => reject(request.error);
        });
    }

    async function getTooltipConfiguration(name: string): Promise<LibraryTooltipConfiguration> {
        const db = await openTooltipConfigurations();
        const tx = db.transaction('tooltipConfigurations', 'readonly');
        const store = tx.objectStore('tooltipConfigurations');
        return await new Promise<LibraryTooltipConfiguration>((resolve, reject) => {
            const request = store.get(name);
            request.onsuccess = () => resolve(request.result as LibraryTooltipConfiguration);
            request.onerror = () => reject(request.error);
        });
    }

    async function deleteTooltipConfiguration(name: string): Promise<void> {
        const db = await openTooltipConfigurations();
        const tx = db.transaction('tooltipConfigurations', 'readwrite');
        const store = tx.objectStore('tooltipConfigurations');
        store.delete(name);
        return await new Promise<void>((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    async function updateTooltipConfiguration(configuration: LibraryTooltipConfiguration): Promise<void> {
        const db = await openTooltipConfigurations();
        const tx = db.transaction('tooltipConfigurations', 'readwrite');
        const store = tx.objectStore('tooltipConfigurations');
        store.put(configuration);
        return await new Promise<void>((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    function getBase64Image(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    }

    function validateImageFile(file: File) {
        return file.type === 'image/png' || file.type === 'image/jpeg';
    }

    function validateImageFileSize(file: File) {
        return file.size <= 5 * 1024 * 1024;
    }

    function validateConfigurationFile(file: File) {
        const supportedFileTypes = [
            'application/json',
            'text/yaml',
            'text/yml',
            'text/plain',
            'text/java',
            'text/x-csharp',
            'text/x-cplusplus',
        ];
        return supportedFileTypes.includes(file.type);
    }

    function validateConfigurationFileSize(file: File) {
        return file.size <= 5 * 1024 * 1024;
    }

    return {
        openImages,
        openItems,
        openExportConfigurations,
        saveImage,
        saveItem,
        saveExportConfiguration,
        validateImageFile,
        validateImageFileSize,
        getImages,
        getItems,
        getImage,
        getItem,
        getExportConfiguration,
        deleteImage,
        deleteItem,
        deleteExportConfiguration,
        getExportConfigurations,
        updateExportConfiguration,
        saveTooltipConfiguration,
        getTooltipConfigurations,
        getTooltipConfiguration,
        deleteTooltipConfiguration,
        updateTooltipConfiguration,
        getBase64Image,
    };
}
