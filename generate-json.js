const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

// Relative paths from monorepo root
const PATHS = {
    item: 'packages/assets/images/minecraft/textures/item/',
    block: 'packages/assets/images/minecraft/textures/block/',
    upscale: 'packages/assets/images/minecraft/upscaled/',
    output: 'packages/assets/images/minecraft/textures.json',
};

// Get absolute path for processing, but store relative path
const getAbsolutePath = (relativePath) => path.join(__dirname, relativePath);

// Ensure directory exists
const ensureDirectoryExists = async (dir) => {
    try {
        await fs.mkdir(getAbsolutePath(dir), { recursive: true });
    } catch (err) {
        console.error(`Error creating directory ${dir}:`, err);
    }
};

// Get and process textures
const getTextures = async (dir) => {
    try {
        const absoluteDir = getAbsolutePath(dir);
        // Read the files in the directory
        const files = (await fs.readdir(absoluteDir)).filter((file) => file.endsWith('.png'));

        const processedTextures = await Promise.all(
            files.map(async (file) => {
                const image = sharp(path.join(absoluteDir, file));
                const metadata = await image.metadata();
                const upscaleFactor = 128 / Math.max(metadata.width, metadata.height);

                const upscaledFileName = `upscaled_${file}`;
                // Store relative path for JSON
                const relativePath = path.join(PATHS.upscale, upscaledFileName);
                // Use absolute path for processing
                const absoluteUpscaledPath = getAbsolutePath(relativePath);

                // Process the image: resize and save
                await image
                    .resize({
                        width: Math.round(metadata.width * upscaleFactor),
                        height: Math.round(metadata.height * upscaleFactor),
                        fit: 'inside',
                        kernel: 'nearest',
                    })
                    .toFile(absoluteUpscaledPath);

                return {
                    name: file,
                    originalPath: path.join(dir, file), // Store relative original path
                    upscaledPath: relativePath, // Store relative upscaled path
                };
            }),
        );

        return processedTextures;
    } catch (err) {
        console.error(`Error processing textures in ${dir}:`, err);
        return [];
    }
};

// Generate textures and write JSON
const generateTextures = async () => {
    await ensureDirectoryExists(PATHS.upscale);

    try {
        const [itemTextures, blockTextures] = await Promise.all([getTextures(PATHS.item), getTextures(PATHS.block)]);

        const textures = [...itemTextures, ...blockTextures];

        await fs.writeFile(getAbsolutePath(PATHS.output), JSON.stringify(textures, null, 2));

        console.log('Texture processing complete!');
    } catch (err) {
        console.error('Error generating textures:', err);
    }
};

generateTextures().catch((err) => console.error('Unexpected error:', err));
