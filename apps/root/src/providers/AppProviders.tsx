'use client';

import React from 'react';
import StoreProvider from '~/lib/store/StoreProvider';
import { ConfirmationProvider } from '~/providers/ConfirmationProvider';
import { StorageProvider } from '~/providers/StorageProvider';
import { useLocalSave } from '~/hooks/useLocalSave';

interface AppProvidersProps {
    children: React.ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => {
    const storageProvider = useLocalSave();

    return (
        <StoreProvider>
            <ConfirmationProvider>
                <StorageProvider
                    provider={{
                        ...storageProvider,
                        type: 'local',
                    }}
                >
                    {children}
                </StorageProvider>
            </ConfirmationProvider>
        </StoreProvider>
    );
};

export default AppProviders;
