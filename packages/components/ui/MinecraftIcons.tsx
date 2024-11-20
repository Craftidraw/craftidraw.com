import React, { useEffect, useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { useIndexedDB } from '~/hooks/useIndexedDB';
import type { LibraryImage } from '~/types/library';
import DOMPurify from 'dompurify';

interface TextureItem {
    name: string;
}

interface MinecraftIconsProps {
    searchTerm: string;
    selectedLibraryImage: LibraryImage | null;
    setSelectedLibraryImage: (libraryImage: LibraryImage | null) => void;
}

const MinecraftIcons = ({ searchTerm, selectedLibraryImage, setSelectedLibraryImage }: MinecraftIconsProps) => {
    const { getBase64Image } = useIndexedDB();
    const [textures, setTextures] = useState<TextureItem[]>([]);
    const [convertedTextures, setConvertedTextures] = useState<Record<string, LibraryImage>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const { ref, inView } = useInView();

    const fetchTextures = useCallback(async () => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);

        try {
            const response = await fetch(`/api/textures?page=${page}&search=${searchTerm}`);
            const data = await response.json();

            if (data.textures.length === 0) {
                setHasMore(false);
            } else {
                setTextures((prev) => [...prev, ...data.textures]);
                setPage((prev) => prev + 1);
            }
        } catch (error) {
            console.error('Failed to fetch textures:', error);
        } finally {
            setIsLoading(false);
        }
    }, [page, searchTerm, isLoading, hasMore]);

    const handleTextureClick = async (texture: TextureItem, index: number) => {
        if (convertedTextures[texture.name]) {
            setSelectedLibraryImage(convertedTextures[texture.name]);
            return;
        }

        try {
            const response = await fetch(`/api/textures/${texture.name}`);
            const blob = await response.blob();
            const file = new File([blob], texture.name, { type: 'image/png' });
            const base64Image = await getBase64Image(file);

            const selectedImage: LibraryImage = {
                id: 3123574470 + index,
                name: texture.name.replace('.png', ''),
                data: base64Image,
                date: new Date().toISOString(),
                size: blob.size,
            };

            setConvertedTextures((prev) => ({
                ...prev,
                [texture.name]: selectedImage,
            }));

            setSelectedLibraryImage(selectedImage);
        } catch (error) {
            console.error(`Could not convert texture ${texture.name}:`, error);
        }
    };

    // Reset when search changes
    useEffect(() => {
        setTextures([]);
        setPage(1);
        setHasMore(true);
    }, [searchTerm]);

    // Load more when scrolled to bottom
    useEffect(() => {
        if (inView) {
            void fetchTextures();
        }
    }, [inView, fetchTextures]);

    return (
        <div className='library-image-collection-container'>
            <div className='overflow-y-auto'>
                <div className='texture-grid'>
                    {textures
                        .filter((texture) => texture.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((texture, index) => (
                            <img
                                key={index}
                                className={`texture-grid-image ${selectedLibraryImage?.name === texture.name ? 'selected' : ''}`}
                                src={DOMPurify.sanitize(`/api/textures/${texture.name}`)}
                                alt={texture.name.replace('.png', '')}
                                title={texture.name.replace('.png', '')}
                                onClick={() => handleTextureClick(texture, index)}
                                loading='lazy'
                            />
                        ))}
                </div>
                <div ref={ref} className='d-flex justify-content-center my-3'>
                    {isLoading && <div className='spinner-border' role='status' />}
                </div>
            </div>
        </div>
    );
};

export default MinecraftIcons;
