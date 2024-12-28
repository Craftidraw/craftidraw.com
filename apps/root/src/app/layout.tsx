import { type Metadata } from 'next';
import AppProviders from '~/providers/AppProviders';
import Script from 'next/script';
import '~/styles/globals.scss';
import React from 'react';

export const metadata: Metadata = {
    metadataBase: new URL('https://craftidraw.com'),
    title: 'Craftidraw | Asset Design Tool',
    description:
        'Create, collaborate, and design game assets, UI mockups, and system diagrams easily. Craftidraw offers an intuitive whiteboard for game developers, designers, and teams to visualize and prototype their next project.',

    openGraph: {
        title: 'Craftidraw | Asset Design Tool',
        description:
            'Create, collaborate, and design game assets, UI mockups, and system diagrams easily. Perfect for game developers and design teams.',
        type: 'website',
        images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    },

    twitter: {
        card: 'summary_large_image',
        title: 'Craftidraw - Asset Design Tool',
        description:
            'Design assets and systems collaboratively. Real-time whiteboarding for game developers and teams.',
    },

    keywords: [
        'game asset design',
        'game development tool',
        'collaborative whiteboard',
        'game UI mockup',
        'system design tool',
        'game prototyping',
        'real-time collaboration',
        'game design platform',
        'gaming assets',
        'team collaboration',
        'item design',
        'item designer',
        'game design',
        'game design tool',
        'minecraft',
        'roblox',
        'ui design',
        'ui mockup',
        'asset design',
    ],

    authors: [{ name: 'flrp', url: 'https://github.com/flrping' }],
    creator: 'Craftidraw',
    publisher: 'Craftidraw',
    icons: [{ rel: 'icon', url: '/favicon.ico' }],

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang='en'>
            <Script src='https://kit.fontawesome.com/baba299d4a.js' crossOrigin="anonymous" strategy='afterInteractive' />
            <body>
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    );
}
