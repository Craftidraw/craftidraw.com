import { Button, Form } from 'react-bootstrap';
import ItemSnapshot from '../../ui/item/ItemSnapshot';
import React, { useEffect, useState } from 'react';
import { useIndexedDB } from '~/hooks/useIndexedDB';
import type { LibraryItem } from '~/types/library';
import type { Item } from '~/types/item';
import createCUID from '~/lib/cuid/createCUID';
import { addItem, addNotification, setIsLibraryOpen, setSelectedItem } from '~/lib/store/features/appSlice';
import { useAppDispatch } from '~/lib/store/hooks';
import { useConfirmation } from '~/providers/ConfirmationProvider';
import { useFileOperations } from '~/hooks/useFileOperations';
import { validateItem } from '~/lib/validate/validateItem';

const LibraryItemBlock: React.FC = () => {
    const dispatch = useAppDispatch();
    const { getItems, deleteItem } = useIndexedDB();
    const { importItem, exportItem } = useFileOperations();
    const { requestConfirmation } = useConfirmation();

    const [loadedItems, setLoadedItems] = useState<LibraryItem[]>([]);
    const [selectedLibraryItem, setSelectedLibraryItem] = useState<LibraryItem | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const loadItems = async () => {
            const items = await getItems();
            setLoadedItems(items.filter((item) => validateItem(JSON.stringify(item)).status));
        };

        void loadItems();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (
                selectedLibraryItem &&
                !target.closest('.library-image') &&
                !target.closest('.library-image-collection')
            ) {
                setSelectedLibraryItem(null);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [selectedLibraryItem]);

    const handleItemSelect = () => {
        if (!selectedLibraryItem) return;

        const item = {
            ...selectedLibraryItem.item,
            id: createCUID(),
            x: 0,
            y: 0,
            attachments: [],
        } as Item;

        dispatch(addItem(item));
        dispatch(setSelectedItem(item.id));
        dispatch(
            addNotification({
                id: createCUID(),
                type: 'success',
                title: 'Item Added',
                message: 'Item successfully pasted to the board.',
            }),
        );

        setSelectedLibraryItem(null);
        dispatch(setIsLibraryOpen(false));
    };

    const handleItemDelete = async () => {
        if (!selectedLibraryItem) return;
        const confirmed = await requestConfirmation('Are you sure you want to delete this item?');
        if (!confirmed) return;
        try {
            await deleteItem(selectedLibraryItem.id);
            const items = await getItems();
            setLoadedItems(items);
            setSelectedLibraryItem(null);
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'success',
                    title: 'Item Deleted',
                    message: 'Item successfully deleted.',
                }),
            );
        } catch (error) {
            console.error('Error deleting item:', error);
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'error',
                    title: 'Error Deleting Item',
                    message: "Couldn't delete item.",
                }),
            );
        }
    };

    return (
        <div>
            <div className='d-flex flex-row mt-2'>
                <div>
                    <Button
                        className='me-1'
                        variant='secondary'
                        size='sm'
                        onClick={async () => {
                            await importItem().then(() => {
                                void getItems().then((items) => setLoadedItems(items));
                            });
                        }}
                    >
                        Upload
                    </Button>
                    <Button
                        variant='secondary'
                        size='sm'
                        onClick={async () => {
                            await exportItem();
                        }}
                    >
                        Export
                    </Button>
                </div>
                <div className='d-flex flex-row ms-auto'>
                    {selectedLibraryItem && (
                        <Button className='me-1' variant='primary' size='sm' onClick={() => handleItemSelect()}>
                            Paste
                        </Button>
                    )}
                    <Button className='me-1' variant='secondary' size='sm' onClick={() => handleItemDelete()}>
                        <i className='fa-solid fa-trash'></i>
                    </Button>
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
                {loadedItems
                    .filter((dbItem) => dbItem.item.type.includes(searchTerm))
                    .map((dbItem) => (
                        <div
                            key={dbItem.item.id + '-saved'}
                            className='d-flex col-3 library-image'
                            onClick={() => setSelectedLibraryItem(dbItem)}
                        >
                            <div
                                className={
                                    'd-flex flex-column align-items-center library-image-container' +
                                    (dbItem.id === selectedLibraryItem?.id ? ' selected' : '')
                                }
                            >
                                <div style={{ padding: '5px' }}>
                                    <ItemSnapshot item={dbItem.item} />
                                </div>
                                <div
                                    className='d-flex flex-column library-image-details'
                                    style={{ width: '100%', height: '100%' }}
                                >
                                    <div className='mt-auto'>
                                        <h6>{dbItem.item.type}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                {loadedItems.length === 0 && (
                    <div className='d-flex flex-column align-items-center' style={{ width: '100%' }}>
                        <small>No items found.</small>
                        <small>Save or upload an item to get started.</small>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LibraryItemBlock;
