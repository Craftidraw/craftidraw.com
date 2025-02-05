import posthogCjs, { type PostHog } from 'posthog-js';
import { useEffect, useState } from 'react';
import useCookie from './useConsent';

export function usePostHog() {
    const { cookieConsent, isLoading: isCookieLoading } = useCookie();
    const [posthog, setPosthog] = useState<PostHog | null>(null);

    useEffect(() => {
        if (isCookieLoading) return;
        if (cookieConsent?.analytics) {
            const instance = posthogCjs.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
                api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
                person_profiles: 'identified_only',
            });

            setPosthog(instance ?? null);

            if (posthogCjs.__loaded) {
                posthogCjs.identify();
            }
        } else {
            posthogCjs.reset();
            setPosthog(null);
        }
    }, [cookieConsent?.analytics, isCookieLoading]);

    return posthog;
}
