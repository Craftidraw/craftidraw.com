import type { Item } from './item';

export interface Board {
    id: string | null;
    name: string;
    enableGrid: boolean;
    snapToGrid: boolean;
    gridSpacing: number;
    subGridSpacing: number;
    snapIncrement: number;
    showItems: boolean;
    theme: 'system' | 'light' | 'dark';
    gridLineColor: string;
    gridLineWidth: number;
    gridLineOpacity: number;
    gridSubLineColor: string;
    gridSubLineWidth: number;
    gridSubLineOpacity: number;
    backgroundColor: string;
}

export interface BoardShell {
    id: string;
    name: string;
}

export interface BoardCollection {
    id: number;
    name: string;
    boards: BoardShell[];
    order: number;
}

export interface BoardInfo {
    board: Board;
    mode: 'editor' | 'viewer' | 'commenter';
    source: 'workspace' | 'invite' | 'link' | 'public';
    collectionId: number | undefined | null;
    dateAccessed: Date | undefined;
    items?: Item[];
}
