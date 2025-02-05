'use client';

import { useEffect, useState } from 'react';
import createCUID from '~/lib/cuid/createCUID';
import { removeNotification } from '~/lib/store/features/appSlice';
import type { CookiePreferences } from '~/types/preferences';
import { useAppDispatch } from '~/lib/store/hooks';
import useNotification from '~/providers/NotificationProvider';

const useConsent = () => {
    const dispatch = useAppDispatch();
    const [cookieConsent, setCookieConsent] = useState<CookiePreferences | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { registerNotification } = useNotification();

    useEffect(() => {
        const storedConsent = JSON.parse(localStorage.getItem('consentSettings') ?? '{}') as CookiePreferences;
        setCookieConsent(storedConsent);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (cookieConsent !== null) {
            localStorage.setItem('consentSettings', JSON.stringify(cookieConsent));
        }
    }, [cookieConsent]);

    const ask = (
        cookieName: keyof CookiePreferences,
        title: string,
        message: string,
        accept?: {
            text: string;
            onClick?: () => void;
        },
        decline?: {
            text: string;
            onClick?: () => void;
        },
    ) => {
        const notificationId = createCUID();
        const acceptCallbackId = createCUID();
        const declineCallbackId = createCUID();

        const acceptCallback = accept
            ? () => {
                  setCookieConsent((prev) => ({
                      ...(prev ?? {}),
                      [cookieName]: true,
                  }));
                  dispatch(removeNotification(notificationId));
                  accept.onClick?.();
              }
            : undefined;

        const declineCallback = decline
            ? () => {
                  setCookieConsent((prev) => ({
                      ...(prev ?? {}),
                      [cookieName]: false,
                  }));
                  dispatch(removeNotification(notificationId));
                  decline.onClick?.();
              }
            : undefined;

        registerNotification(
            {
                id: notificationId,
                title,
                message,
                type: 'success',
                required: true,
                accept: accept
                    ? {
                          text: accept.text ?? 'Accept',
                          callbackId: acceptCallbackId,
                      }
                    : undefined,
                decline: decline
                    ? {
                          text: decline.text ?? 'Decline',
                          callbackId: declineCallbackId,
                      }
                    : undefined,
            },
            acceptCallback,
            declineCallback,
        );
    };

    return { cookieConsent, ask, isLoading };
};

export default useConsent;
