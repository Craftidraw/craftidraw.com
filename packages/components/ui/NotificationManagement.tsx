import type { Notification } from '~/types/notification';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '~/lib/store/hooks';
import { removeNotification, selectAllNotifications } from '~/lib/store/features/appSlice';

const NotificationManagement = () => {
    const notifications = useAppSelector(selectAllNotifications);

    return (
        <div id='notification-wrapper'>
            {notifications.map((notification, index) => (
                <NotificationItem key={notification.id} notification={notification} />
            ))}
        </div>
    );
};

const NotificationItem = ({ notification }: { notification: Notification }) => {
    const dispatch = useAppDispatch();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
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
    }, []);

    return (
        <div className={`notification notification-${notification.type}`}>
            <div className='progress'>
                <div
                    className='progress-bar'
                    style={{ width: `${progress}%` }}
                    role='progressbar'
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                ></div>
            </div>
            <div className='notification-body'>
                <h6>{notification.title}</h6>
                <p>{notification.message}</p>
            </div>
        </div>
    );
};

export default NotificationManagement;
