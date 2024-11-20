import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Cache for textures list
let texturesCache: Array<{
    name: string;
}> | null = null;

async function getAllTextures() {
    if (texturesCache) {
        return texturesCache;
    }

    try {
        // Get the project root directory
        const projectRoot = process.cwd().split('apps')[0]!;
        const upscaledPath = path.join(projectRoot, 'packages/assets/images/minecraft/upscaled');

        // Read all files in the upscale directory
        const files = await fs.readdir(upscaledPath);

        // Filter for PNG files and create texture objects
        texturesCache = files
            .filter((file) => file.toLowerCase().endsWith('.png'))
            .map((file) => ({
                name: file.split('upscaled_')[1],
            })) as { name: string }[];

        return texturesCache;
    } catch (error) {
        console.error('Error reading textures directory:', error);
        return [];
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') ?? '1');
        const limit = 25; // Number of items per batch
        const offset = (page - 1) * limit;

        const textures = await getAllTextures();
        const paginatedTextures = textures.slice(offset, offset + limit);

        return new NextResponse(
            JSON.stringify({
                textures: paginatedTextures,
            }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=3600',
                },
            },
        );
    } catch {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
