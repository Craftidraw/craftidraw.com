import { type Item } from "~/types/item";

export const validateItem = (item: string) => {
    let parsedItem: Item;
    try {
        parsedItem = JSON.parse(item) as Item;
    } catch {
        return false;
    }
    return true;
};

/**
 * Attempts to fix the item by either adding missing properties or removing properties that are not valid.
 * This function should be smart enough to fix most common issues or outdated properties.
 * @param item The item string to fix.
 * @returns The fixed item, or false if the item is not fixable.
 */
export const fixItem = (item: string): Item | false => {
    try {
        const parsed = JSON.parse(item);

        if (!parsed.id || !parsed.type) {
            return false;
        }

        // Fix position property
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
            parsed.position = {
                x: parsed.x,
                y: parsed.y,
            };
            delete parsed.x;
            delete parsed.y;
        }

        // Fix size property
        if (typeof parsed.width === 'number' && typeof parsed.height === 'number') {
            parsed.size = {
                width: parsed.width,
                height: parsed.height,
            };
            delete parsed.width;
            delete parsed.height;
        }

        // Ensure position exists
        if (!parsed.position) {
            parsed.position = { x: 0, y: 0 };
        }

        // Ensure size exists for applicable types
        if (['rectangle', 'circle', 'image', 'text', 'custom'].includes(parsed.type) && !parsed.size) {
            parsed.size = { width: 100, height: 100 };
        }

        // Fix base properties
        parsed.opacity = parsed.opacity ?? 1;
        parsed.isStrokeable = parsed.isStrokeable ?? true;
        parsed.isFillable = parsed.isFillable ?? true;
        parsed.attachments = parsed.attachments ?? [];

        // Fix stroke properties
        if (parsed.isStrokeable) {
            parsed.strokeColor = parsed.strokeColor ?? '#000000';
            parsed.strokeOpacity = parsed.strokeOpacity ?? 1;
            parsed.strokeWidth = parsed.strokeWidth ?? 2;
            parsed.strokeStyle = parsed.strokeStyle ?? 'solid';
            parsed.isStokeEnabled = parsed.isStokeEnabled ?? true;
        }

        // Fix fill properties
        if (parsed.isFillable) {
            parsed.fillColor = parsed.fillColor ?? '#ffffff';
            parsed.fillOpacity = parsed.fillOpacity ?? 1;
            parsed.isFillEnabled = parsed.isFillEnabled ?? true;
        }

        // Type-specific fixes
        switch (parsed.type) {
            case 'line':
                parsed.points = parsed.points ?? [0, 0, 100, 0];
                parsed.isArrow = parsed.isArrow ?? false;
                break;

            case 'text':
                parsed.text = parsed.text ?? '';
                parsed.textAlign = parsed.textAlign ?? 'left';
                parsed.fontSize = parsed.fontSize ?? 16;
                parsed.fontFamily = parsed.fontFamily ?? 'Arial';
                parsed.fontEffect = parsed.fontEffect ?? 'normal';
                parsed.fontDecoration = parsed.fontDecoration ?? 'none';
                break;

            case 'custom':
                parsed.entity = parsed.entity ?? '';
                parsed.showTooltip = parsed.showTooltip ?? false;
                break;
        }

        return parsed;
    } catch {
        return false;
    }
};
