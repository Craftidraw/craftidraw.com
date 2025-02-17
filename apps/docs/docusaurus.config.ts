import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
    title: 'Craftidraw',
    tagline: 'Documentation',
    favicon: 'img/favicon.ico',

    // Set the production url of your site here
    url: 'https://docs.craftidraw.com',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'Craftidraw', // Usually your GitHub org/user name.
    projectName: 'docs.craftidraw.com', // Usually your repo name.

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    scripts: [
        {
            src: 'https://kit.fontawesome.com/baba299d4a.js',
            crossorigin: 'anonymous',
            strategy: 'afterInteractive',
        },
    ],

    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    routeBasePath: '/', // This removes the /docs prefix
                    path: 'docs',
                    sidebarPath: require.resolve('./sidebars.js'),
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            },
        ],
    ],

    themeConfig: {
        image: 'img/docusaurus-social-card.jpg',
        navbar: {
            title: 'Craftidraw Docs',
            logo: {
                alt: 'craftidraw-logo',
                src: 'img/craftidraw-logo.png',
            },
        },
        footer: {
            style: 'dark',
            copyright: `Copyright © ${new Date().getFullYear()} Craftidraw. Built with Docusaurus.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
