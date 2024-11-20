import { Popover } from 'react-bootstrap';
import { createPortal } from 'react-dom';
import React, { useEffect, useState } from 'react';

interface PopoverPortalProps {
    children: React.ReactNode;
    show: boolean;
    target: HTMLElement | null;
    onHide: () => void;
}

const PopoverPortal = ({ children, show, target, onHide }: PopoverPortalProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted || !show || !target) return null;

    const targetRect = target.getBoundingClientRect();

    const popoverStyle = {
        position: 'fixed' as const,
        top: targetRect.top + window.scrollY,
        left: targetRect.right + window.scrollX + 10,
        zIndex: 1050,
    };

    return createPortal(
        <>
            <div
                className='portal-backdrop'
                onClick={onHide}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1040,
                }}
            />
            <Popover style={popoverStyle} arrowProps={{ hidden: true }}>
                <Popover.Body>{children}</Popover.Body>
            </Popover>
        </>,
        document.body,
    );
};

export default PopoverPortal;
