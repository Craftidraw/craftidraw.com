import React, { createContext, useContext, useRef } from 'react';
import type { Notification } from '~/types/notification';
import { addNotification } from '~/lib/store/features/appSlice';
import { useAppDispatch } from '~/lib/store/hooks';
import createCUID from '~/lib/cuid/createCUID';

interface NotificationContextType {
    registerNotification: (
        notification: Notification,
        acceptCallback?: () => void,
        declineCallback?: () => void,
    ) => void;
    executeCallback: (callbackId: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    const callbackMapRef = useRef(new Map<string, () => void>());

    const registerNotification = (
        notification: Notification,
        acceptCallback?: () => void,
        declineCallback?: () => void,
    ) => {
        const acceptCallbackId = notification.accept?.callbackId ?? createCUID();
        const declineCallbackId = notification.decline?.callbackId ?? createCUID();

        const updatedNotification = {
            ...notification,
            accept: notification.accept ? { ...notification.accept, callbackId: acceptCallbackId } : undefined,
            decline: notification.decline ? { ...notification.decline, callbackId: declineCallbackId } : undefined,
        };

        if (acceptCallback) {
            callbackMapRef.current.set(acceptCallbackId, acceptCallback);
        }
        if (declineCallback) {
            callbackMapRef.current.set(declineCallbackId, declineCallback);
        }

        dispatch(addNotification(updatedNotification));
    };

    const executeCallback = (callbackId: string) => {
        const callback = callbackMapRef.current.get(callbackId);
        if (callback) {
            callback();
            callbackMapRef.current.delete(callbackId);
        }
    };

    return (
        <NotificationContext.Provider value={{ registerNotification, executeCallback }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export default useNotification;
