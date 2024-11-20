import type { BoardInfo } from '~/types/board';
import React, { createContext, useContext } from 'react';
import type { Item } from '~/types/item';

interface StorageProviderProps {
    type: 'local' | 'cloud';
    requestItemSave: (items: Item[], callback: (success: boolean) => void) => void;
    requestBoardSave: (boardInfo: BoardInfo, callback: (success: boolean) => void) => void;
    requestImmediateBoardSave: (boardInfo: BoardInfo, callback: (success: boolean) => void) => void;
    saveItems: (items: Item[]) => boolean;
    saveBoard: (boardInfo: BoardInfo) => boolean;
    markForDeletion: (id: string) => void;
    unmarkForDeletion: (id: string) => void;
}

const StorageContext = createContext<StorageProviderProps | null>(null);

export const useStorage = () => {
    const context = useContext(StorageContext);
    if (!context) {
        throw new Error('useStorage must be used within a StorageProvider');
    }
    return context;
};

export const StorageProvider = ({
    children,
    provider,
}: {
    children: React.ReactNode;
    provider: {
        type: 'local' | 'cloud';
        requestItemSave: (items: Item[], callback: (success: boolean) => void) => void;
        requestBoardSave: (boardInfo: BoardInfo, callback: (success: boolean) => void) => void;
        requestImmediateBoardSave: (boardInfo: BoardInfo, callback: (success: boolean) => void) => void;
        saveItems: (items: Item[]) => boolean;
        saveBoard: (boardInfo: BoardInfo) => boolean;
        markForDeletion: (id: string) => void;
        unmarkForDeletion: (id: string) => void;
    };
}) => {
    return <StorageContext.Provider value={provider}>{children}</StorageContext.Provider>;
};
