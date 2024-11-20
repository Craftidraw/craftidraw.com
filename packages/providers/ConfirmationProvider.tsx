'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

interface ConfirmationContextProps {
    requestConfirmation: (message: string) => Promise<boolean>;
}

const ConfirmationContext = createContext<ConfirmationContextProps | undefined>(undefined);

export const useConfirmation = () => {
    const context = useContext(ConfirmationContext);
    if (!context) {
        throw new Error('useConfirmation must be used within a ConfirmationProvider');
    }
    return context;
};

export const ConfirmationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

    const requestConfirmation = useCallback((message: string) => {
        return new Promise<boolean>((resolve) => {
            setMessage(message);
            setResolvePromise(() => resolve);
            setIsOpen(true);
        });
    }, []);

    const confirm = useCallback(() => {
        if (resolvePromise) {
            resolvePromise(true);
            setIsOpen(false);
        }
    }, [resolvePromise]);

    const deny = useCallback(() => {
        if (resolvePromise) {
            resolvePromise(false);
            setIsOpen(false);
        }
    }, [resolvePromise]);

    return (
        <ConfirmationContext.Provider value={{ requestConfirmation }}>
            {children}
            <Modal show={isOpen} onHide={deny} centered>
                <Modal.Body className='d-flex flex-column'>
                    <h5>Hold on!</h5>
                    <p>{message}</p>
                    <div className='ms-auto'>
                        <Button variant='secondary' size='sm' onClick={deny}>
                            Cancel
                        </Button>
                        <Button variant='primary' className='ms-2' size='sm' onClick={confirm}>
                            Confirm
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </ConfirmationContext.Provider>
    );
};
