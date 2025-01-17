import type { LibraryImage, LibraryTooltipConfiguration } from './library';

export interface Position {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export interface Item {
    id: string;
    type: string;
    position: Position;
    version: number;

    isStrokeable: boolean;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeStyle?: string;
    strokeWidth?: number;
    isStrokeEnabled?: boolean;

    isFillable: boolean;
    fillColor?: string;
    fillOpacity?: number;
    isFillEnabled?: boolean;

    attachments?: Attachment[];
}

export interface Attachment {
    connector: string;
}

export interface RectangleItem extends Item {
    size: Size;
    borderRadius?: number;
}

export interface CircleItem extends Item {
    size: Size;
}

export interface TextItem extends Item {
    size: Size;
    text: string;
    textAlign: 'left' | 'center' | 'right';
    fontSize: number;
    fontFamily?: string;
    fontEffect?: 'normal' | 'bold' | 'italic';
    fontDecoration?: 'none' | 'underline' | 'line-through';
}

export interface LineItem extends Item {
    points: number[];
    isArrow: boolean;
    hasArrowTail?: boolean;
    hasArrowHead?: boolean;
    headConnector?: {
        connected: string;
    };
    tailConnector?: {
        connected: string;
    };
}

export interface ImageItem extends Item {
    size: Size;
    borderRadius?: number;
    image?: LibraryImage;
}

export interface DrawItem extends Item {
    size: Size;
    points: number[];
}

export interface TooltipLine {
    text: string;
    textAlign?: 'left' | 'center' | 'right';
    fontSize: number;
    fontFamily?: string;
    fontEffect?: string;
    fontDecoration?: 'none' | 'underline' | 'line-through';
}

export interface TooltipSettings {
    strokeColor?: string;
    strokeStyle?: string;
    strokeWidth?: number;
    isStokeEnabled?: boolean;
    fillColor?: string;
    isFillEnabled?: boolean;
    borderRadius?: number;
}

export interface Tooltip {
    config?: LibraryTooltipConfiguration;
    position: Position; // THIS IS RELATIVE TO THE ITEM, NOT THE CANVAS. STARTS FROM THE TOP RIGHT CORNER OF THE ITEM.
    size: Size;
}

export interface CustomItem extends Item {
    size: Size;
    entity: string;
    image?: LibraryImage;
    showTooltip?: boolean;
    displayName?: TooltipLine;
    lore?: TooltipLine[];
    tooltip: Tooltip;
}