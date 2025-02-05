import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '~/lib/store/hooks';
import { removeNotification, selectAllNotifications } from '~/lib/store/features/appSlice';
import type { Notification } from '~/types/notification';
import { Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import useNotification from '~/providers/NotificationProvider';

interface NotificationContainerProps {
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({ position = 'top-right' }) => {
    const notifications = useAppSelector(selectAllNotifications);

    const getPositionClasses = () => {
        const baseClasses = 'position-fixed d-flex flex-column gap-3 p-3';
        switch (position) {
            case 'top-left':
                return `${baseClasses} top-0 start-0`;
            case 'bottom-right':
                return `${baseClasses} bottom-0 end-0`;
            case 'bottom-left':
                return `${baseClasses} bottom-0 start-0`;
            default:
                return `${baseClasses} top-0 end-0`;
        }
    };

    return (
        <div className={getPositionClasses()} style={{ maxWidth: '400px', zIndex: 1050 }}>
            {notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
            ))}
        </div>
    );
};

const NotificationItem = ({ notification }: { notification: Notification }) => {
    const dispatch = useAppDispatch();
    const { executeCallback } = useNotification();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!notification.required) {
            const startTime = Date.now();
            const duration = 5000;
            const interval = setInterval(() => {
                const elapsedTime = Date.now() - startTime;
                const progressValue = Math.min((elapsedTime / duration) * 100, 100);
                setProgress(progressValue);
                if (progressValue === 100) {
                    clearInterval(interval);
                    dispatch(removeNotification(notification.id));
                }
            }, 50);

            return () => clearInterval(interval);
        }
    }, [dispatch, notification.id, notification.required]);

    const getNotificationClasses = () => {
        const baseClasses = 'notification notification-';
        switch (notification.type) {
            case 'success':
                return `${baseClasses}success   `;
            case 'error':
                return `${baseClasses}error`;
            case 'warning':
                return `${baseClasses}warning`;
            default:
                return `${baseClasses}info`;
        }
    };

    const getContextualClass = () => {
        switch (notification.type) {
            case 'error':
                return 'danger';
            default:
                return notification.type;
        }
    };

    return (
        <div className={getNotificationClasses()}>
            {!notification.required && (
                <div className='progress rounded-0 rounded-top' style={{ height: '3px' }}>
                    <div
                        className={`progress-bar bg-${getContextualClass()}`}
                        style={{ width: `${progress}%` }}
                        role='progressbar'
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    />
                </div>
            )}
            <div className='notification-content'>
                <div className='notification-header'>
                    <h6 className='mb-0'>{notification.title}</h6>
                    {!notification.required && (
                        <Button
                            variant='empty'
                            onClick={() => dispatch(removeNotification(notification.id))}
                            aria-label='Close'
                        >
                            <i className='fa-solid fa-xmark text-muted'></i>
                        </Button>
                    )}
                </div>
                <div className='notification-body'>
                    <div className='notification-text'>
                        <ReactMarkdown>{notification.message}</ReactMarkdown>
                    </div>
                    {(notification.accept ?? notification.decline) && (
                        <div className='d-flex mt-3 gap-2'>
                            {notification.accept && (
                                <Button
                                    variant='primary'
                                    onClick={() => executeCallback(notification.accept?.callbackId ?? '')}
                                >
                                    {notification.accept.text}
                                </Button>
                            )}
                            {notification.decline && (
                                <Button
                                    variant='secondary'
                                    onClick={() => executeCallback(notification.decline?.callbackId ?? '')}
                                >
                                    {notification.decline.text}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationContainer;
