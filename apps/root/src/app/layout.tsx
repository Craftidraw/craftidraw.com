import { type Metadata } from 'next';
import AppProviders from '~/providers/AppProviders';
import Script from 'next/script';
import '~/styles/globals.scss';
import React from 'react';

export const metadata: Metadata = {
    title: 'Craftidraw',
    description: 'Design your projects easily.',
    icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang='en'>
            <Script src='https://kit.fontawesome.com/baba299d4a.js' strategy='afterInteractive' />
            <body>
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    );
}
