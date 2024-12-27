import type { Item } from './item';

export interface History {
    index: number;
    actions: HistoryAction[];
}

export interface HistoryAction {
    type: 'create' | 'update' | 'delete';
    previousSnapshots?: Item[];
    currentSnapshots?: Item[];
}
