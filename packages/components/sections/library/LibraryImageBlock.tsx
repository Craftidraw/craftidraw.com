import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import MinecraftIcons from '../../ui/MinecraftIcons';
import { useAppDispatch, useAppSelector } from '~/lib/store/hooks';
import { useItem } from '~/hooks/useItem';
import { useIndexedDB } from '~/hooks/useIndexedDB';
import type { LibraryImage } from '~/types/library';
import type { CustomItem, ImageItem } from '~/types/item';
import DOMPurify from 'dompurify';
import type { RootState } from '~/lib/store/store';
import createCUID from '~/lib/cuid/createCUID';
import { useConfirmation } from '~/providers/ConfirmationProvider';
import { addNotification, selectItemById, setIsLibraryOpen } from '~/lib/store/features/appSlice';
import { useFileOperations } from '~/hooks/useFileOperations';

const LibraryImageBlock: React.FC = () => {
    const dispatch = useAppDispatch();
    const { updateItem } = useItem();
    const { getImages, deleteImage } = useIndexedDB();
    const { importImage } = useFileOperations();
    const { requestConfirmation } = useConfirmation();

    const selectedItem = useAppSelector((state: RootState) => state.app.selectedItem);
    const currentItem = useAppSelector((state: RootState) => selectItemById(state, selectedItem ?? ''));

    const [selectedLibraryImage, setSelectedLibraryImage] = useState<LibraryImage | null>(null);
    const [loadedImages, setLoadedImages] = useState<LibraryImage[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const loadImages = async () => {
            const images = await getImages();
            setLoadedImages(images);
        };

        void loadImages();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (
                selectedLibraryImage &&
                !target.closest('.library-image') &&
                !target.closest('.library-image-collection')
            ) {
                setSelectedLibraryImage(null);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [selectedLibraryImage]);

    const handleImageSelect = useCallback(() => {
        if (!selectedLibraryImage || !selectedItem) return;
        if (currentItem?.type !== 'image' && currentItem?.type !== 'custom') return;

        const updatedItem = {
            ...currentItem,
            image: selectedLibraryImage,
        } as ImageItem | CustomItem;

        updateItem(updatedItem, { ...currentItem });
        
        setSelectedLibraryImage(null);
        dispatch(setIsLibraryOpen(false));
    }, [dispatch, currentItem, selectedLibraryImage, updateItem, selectedItem]);

    const handleImageDelete = async () => {
        if (!selectedLibraryImage) return;
        const confirmed = await requestConfirmation('Are you sure you want to delete this image?');
        if (!confirmed) return;
        try {
            await deleteImage(selectedLibraryImage.id);
            const images = await getImages();
            setLoadedImages(images);
            setSelectedLibraryImage(null);
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'success',
                    title: 'Image Deleted',
                    message: 'Image successfully deleted.',
                }),
            );
        } catch (error) {
            console.error('Error deleting image:', error);
            dispatch(
                addNotification({
                    id: createCUID(),
                    type: 'error',
                    title: 'Error Deleting Image',
                    message: "Couldn't delete image.",
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
                            await importImage().then(() => {
                                void getImages().then((images) => setLoadedImages(images));
                            });
                        }}
                    >
                        Upload
                    </Button>
                </div>
                <div className='d-flex flex-row ms-auto'>
                    {currentItem &&
                        selectedLibraryImage &&
                        (currentItem.type === 'custom' || currentItem.type === 'image') && (
                            <Button className='me-1' variant='primary' size='sm' onClick={() => handleImageSelect()}>
                                Select
                            </Button>
                        )}
                    <Button className='me-1' variant='secondary' size='sm' onClick={() => handleImageDelete()}>
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
                <div className='d-flex col-3 library-image-collection' onClick={() => {}}>
                    <MinecraftIcons
                        searchTerm={searchTerm}
                        selectedLibraryImage={selectedLibraryImage}
                        setSelectedLibraryImage={setSelectedLibraryImage}
                    />
                </div>
                {loadedImages.length === 0 && (
                    <div className='d-flex flex-column align-items-center' style={{ width: '100%' }}>
                        <small>No images found.</small>
                        <small>Upload an image to get started.</small>
                    </div>
                )}
                {loadedImages.map((image) => (
                    <div
                        key={image.id}
                        className='d-flex col-3 library-image'
                        onClick={() => setSelectedLibraryImage(image)}
                    >
                        <div
                            className={
                                'd-flex flex-column align-items-center library-image-container' +
                                (image.id === selectedLibraryImage?.id ? ' selected' : '')
                            }
                        >
                            <div style={{ padding: '5px' }}>
                                <img src={DOMPurify.sanitize(image.data)} alt={DOMPurify.sanitize(image.name)} />
                            </div>
                            <div
                                className='d-flex flex-column library-image-details'
                                style={{ width: '100%', height: '100%' }}
                            >
                                <div className='mt-auto'>
                                    <h6>{DOMPurify.sanitize(image.name)}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LibraryImageBlock;
