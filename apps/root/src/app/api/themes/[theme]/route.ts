import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import type { MonacoTheme } from '~/types/editor';

// Cache themes after first read to avoid repeated disk access
let themesCache: Record<string, MonacoTheme> = {};

async function getTheme(themeName: string): Promise<MonacoTheme | null> {
    // Return cached theme if available
    if (themesCache[themeName]) {
        return themesCache[themeName];
    }

    try {
        // Get project root and construct theme path
        const projectRoot = process.cwd().split('apps')[0]!;
        const themePath = path.join(projectRoot, 'packages/assets/editor/themes', `${themeName}`);

        // Read and parse theme file
        const themeData = await fs.readFile(themePath, 'utf-8');
        const theme = JSON.parse(themeData) as MonacoTheme;

        // Validate theme structure
        if (!theme.base || !theme.rules || !theme.colors) {
            console.error(`Invalid theme structure in ${themeName}`);
            return null;
        }

        // Cache the theme
        themesCache[themeName] = theme;
        return theme;
    } catch (error) {
        console.error(`Error loading theme ${themeName}:`, error);
        return null;
    }
}

export async function GET(request: Request, { params }: { params: { theme: string } }) {
    try {
        const themeName = params.theme;

        // Get theme data
        const theme = await getTheme(themeName);

        if (!theme) {
            return new NextResponse('Theme not found or invalid', { status: 404 });
        }

        // Return the theme with proper headers
        return new NextResponse(JSON.stringify(theme), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Error serving theme:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
