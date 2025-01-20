import React, { useEffect } from 'react';

import { useState } from 'react';

interface FadeComponentProps {
    isLoading: boolean;
    children: React.ReactNode;
}

const FadeComponent = ({ isLoading, children }: FadeComponentProps) => {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => {
                setShouldRender(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    return (
        <div
            className='position-relative'
            style={{
                minHeight: 'calc(100vh - 90px)',
                opacity: shouldRender ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out',
            }}
        >
            {isLoading ? (
                <div className='loader-container'>
                    <div className='spinner-border' role='status'></div>
                </div>
            ) : (
                children
            )}
        </div>
    );
};

export default FadeComponent;
