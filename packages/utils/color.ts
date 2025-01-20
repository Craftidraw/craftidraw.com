export const isHexColor = (color: string): boolean => {
    return /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(color);
};

const isRgbaColor = (color: string): boolean => {
    return /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)$/.test(color);
};

export const isColor = (color: string): boolean => {
    return isHexColor(color) || isRgbaColor(color);
};

export const ensureHexColor = (color: string): string => {
    if (isHexColor(color)) return color;
    if (isRgbaColor(color)) return rgbaToHex(color).color;
    return '#000000';
};

export const ensureRgbaColor = (color: string): string => {
    if (isRgbaColor(color)) return color;
    if (isHexColor(color)) return hexToRgba(color, 1);
    return 'rgba(0, 0, 0, 1)';
};

export const getColorType = (color: string): 'hex' | 'rgba' | 'invalid' => {
    if (isHexColor(color)) return 'hex';
    if (isRgbaColor(color)) return 'rgba';
    return 'invalid';
};

export const hexToRgba = (hex: string, opacity: number): string => {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const rgbaToHex = (rgba: string): { color: string; opacity: number } => {
    const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
    if (!match) return { color: '#000000', opacity: 1 };

    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    const a = match[4] ? parseFloat(match[4]) : 1;

    const hex = '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');

    return { color: hex, opacity: a };
};
