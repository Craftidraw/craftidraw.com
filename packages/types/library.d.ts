import { type Item, type TooltipSettings } from '~/types/item';

export interface ImageCollection {
    id: number;
    name: string;
    images: number[];
}

export interface LibraryImage {
    id: number;
    name: string;
    data: string;
    date: string;
    size: number;
}

export interface ItemCollection {
    id: number;
    name: string;
    items: number[];
}

export interface LibraryItem {
    id: number;
    item: Item;
}

export interface ConfigurationCollection {
    id: number;
    name: string;
    configurations: number[];
}

export interface LibraryExportConfiguration {
    id: number;
    file: File;
    date: Date;
}

export interface LibraryTooltipConfiguration {
    id: number;
    name: string;
    settings: TooltipSettings;
}
