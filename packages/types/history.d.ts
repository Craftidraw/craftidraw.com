export interface History {
    index: number;
    actions: HistoryAction[];
}

export interface HistoryAction {
    type: 'create' | 'delete' | 'update';
    previousSnapshot?: Item;
    currentSnapshot?: Item;
}
