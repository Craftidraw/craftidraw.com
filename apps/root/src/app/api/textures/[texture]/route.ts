import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Cache textures data after first read
let texturesCache: Array<{
    name: string;
    originalPath: string;
    upscaledPath: string;
}> | null = null;

async function getTextures() {
    if (texturesCache) {
        return texturesCache;
    }

    try {
        const projectRoot = process.cwd().split('apps')[0]!;
        const texturesPath = path.join(projectRoot, 'packages', 'assets', 'images', 'minecraft', 'textures.json');
        const texturesData = await fs.readFile(texturesPath, 'utf-8');
        texturesCache = JSON.parse(texturesData);
        return texturesCache;
    } catch {
        return [];
    }
}

export async function GET(request: Request, { params }: { params: { texture: string } }) {
    try {
        const textureName = params.texture;

        // Get textures data
        const textures = await getTextures();

        if (!textures) {
            return new NextResponse('Textures data not found', { status: 404 });
        }

        // Find the requested texture
        const texture = textures.find((t) => t.name === textureName || t.name === `${textureName}.png`);

        if (!texture) {
            return new NextResponse('Texture not found', { status: 404 });
        }

        const projectRoot = process.cwd().split('apps')[0]!;

        // Ensure paths use proper separators for the current OS
        const imagePath = texture.upscaledPath
            ? path.join(projectRoot, ...texture.upscaledPath.split(/[\\/]/))
            : path.join(projectRoot, ...texture.originalPath.split(/[\\/]/));

        try {
            const imageBuffer = await fs.readFile(imagePath);

            // Return the image with proper headers
            return new NextResponse(imageBuffer, {
                headers: {
                    'Content-Type': 'image/png',
                    'Cache-Control': 'public, max-age=31536000, immutable',
                },
            });
        } catch {
            return new NextResponse('Image file not found', { status: 404 });
        }
    } catch {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
