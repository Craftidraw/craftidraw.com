import { createSlice, type PayloadAction, createEntityAdapter, type EntityState } from '@reduxjs/toolkit';
import type { Attachment, Item } from '~/types/item';
import type { Board } from '~/types/board';
import type { History, HistoryAction } from '~/types/history';
import type { Notification } from '~/types/notification';
import type { RootState } from '../store';
import createCUID from '~/lib/cuid/createCUID';
import type { Workspace } from '~/types/workspace';

const workspacesAdapter = createEntityAdapter({
    selectId: (workspace: Workspace) => workspace.id,
});

const itemsAdapter = createEntityAdapter({
    selectId: (item: Item) => item.id,
});

const notificationsAdapter = createEntityAdapter({
    selectId: (notification: Notification) => notification.id,
});

// Initial State
interface AppState {
    workspace: Workspace | null;
    workspaces: EntityState<Workspace, string>;

    board: Board;
    items: EntityState<Item, string>;
    selectedTool: string;
    selectedItem: Item | null;
    selectedConfiguration: number | null;
    copiedItem: Item | null;
    previousTool: string | null;
    history: History;
    isAccountManagerOpen: boolean;
    isLibraryOpen: boolean;
    isCustomExportsOpen: boolean;
    isCustomTooltipsOpen: boolean;
    canvasZoom: number;
    notifications: EntityState<Notification, string>;
    isSaved: 'saved' | 'unsaved' | 'pending' | 'failure';
    isUploaded: 'saved' | 'unsaved' | 'pending' | 'failure';
}

const initialState: AppState = {
    workspace: null,
    workspaces: workspacesAdapter.getInitialState(),
    board: {
        id: createCUID(),
        name: 'New Board',
        enableGrid: true,
        snapToGrid: false,
        gridSpacing: 100,
        subGridSpacing: 20,
        snapIncrement: 5,
        showItems: false,
        theme: 'system',
        gridLineColor: '#000000',
        gridLineWidth: 1,
        gridLineOpacity: 0.1,
        gridSubLineColor: '#000000',
        gridSubLineWidth: 1,
        gridSubLineOpacity: 0.05,
        backgroundColor: '#ffffff',
    },
    items: itemsAdapter.getInitialState(),
    selectedTool: 'pointer',
    selectedItem: null,
    selectedConfiguration: null,
    copiedItem: null,
    previousTool: null,
    history: { actions: [], index: -1 },
    isAccountManagerOpen: false,
    isLibraryOpen: false,
    isCustomExportsOpen: false,
    isCustomTooltipsOpen: false,
    canvasZoom: 1,
    notifications: notificationsAdapter.getInitialState(),
    isSaved: 'saved',
    isUploaded: 'saved',
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setWorkspace: (state, action: PayloadAction<Workspace | null>) => {
            state.workspace = action.payload;
        },
        unsetWorkspace: (state) => {
            state.workspace = null;
        },
        setWorkspaces: (state, action: PayloadAction<Workspace[]>) => {
            state.workspaces = workspacesAdapter.setAll(state.workspaces, action.payload);
        },
        unsetWorkspaces: (state) => {
            state.workspaces = workspacesAdapter.getInitialState();
        },
        addWorkspace: (state, action: PayloadAction<Workspace>) => {
            workspacesAdapter.addOne(state.workspaces, action.payload);
        },
        removeWorkspace: (state, action: PayloadAction<string>) => {
            workspacesAdapter.removeOne(state.workspaces, action.payload);
        },
        setBoard: (state, action: PayloadAction<{ board: Board; items: Item[] }>) => {
            state.board = action.payload.board;
            state.items = itemsAdapter.setAll(state.items, action.payload.items);
        },
        updateBoard: (state, action: PayloadAction<Partial<Board>>) => {
            state.board = { ...state.board, ...action.payload };
        },
        unsetBoard: (state) => {
            state.board = {
                id: createCUID(),
                name: 'New Board',
                enableGrid: true,
                snapToGrid: false,
                gridSpacing: 100,
                subGridSpacing: 20,
                snapIncrement: 5,
                showItems: false,
                theme: 'system',
                gridLineColor: '#000000',
                gridLineWidth: 1,
                gridLineOpacity: 0.1,
                gridSubLineColor: '#000000',
                gridSubLineWidth: 1,
                gridSubLineOpacity: 0.05,
                backgroundColor: '#ffffff',
            };
            state.items = itemsAdapter.getInitialState();
        },
        addItem: (state, action: PayloadAction<Item>) => {
            itemsAdapter.addOne(state.items, action.payload);
        },
        setItem: (state, action: PayloadAction<Item>) => {
            itemsAdapter.upsertOne(state.items, action.payload);
        },
        setItems: (state, action: PayloadAction<Item[]>) => {
            itemsAdapter.setAll(state.items, action.payload);
        },
        deleteItem: (state, action: PayloadAction<string>) => {
            itemsAdapter.removeOne(state.items, action.payload);
        },
        setAttachment: (state, action: PayloadAction<{ item: Item; attachment: Attachment }>) => {
            itemsAdapter.updateOne(state.items, {
                id: action.payload.item.id,
                changes: {
                    attachments: [...(action.payload.item.attachments ?? []), action.payload.attachment],
                },
            });
        },
        addAttachment: (state, action: PayloadAction<{ id: string; attachment: Attachment }>) => {
            itemsAdapter.updateOne(state.items, {
                id: action.payload.id,
                changes: {
                    attachments: [
                        ...(state.items.entities[action.payload.id]?.attachments ?? []),
                        action.payload.attachment,
                    ],
                },
            });
        },
        removeAttachment: (state, action: PayloadAction<{ id: string; attachment: Attachment }>) => {
            const item = state.items.entities[action.payload.id];
            if (item?.attachments) {
                itemsAdapter.updateOne(state.items, {
                    id: action.payload.id,
                    changes: {
                        attachments: [
                            ...(item?.attachments ?? []).filter(
                                (a) => a.connector !== action.payload.attachment.connector,
                            ),
                        ],
                    },
                });
            }
        },
        setSelectedItem: (state, action: PayloadAction<Item | null>) => {
            state.selectedItem = action.payload;
        },
        setSelectedTool: (state, action: PayloadAction<string>) => {
            state.selectedTool = action.payload;
        },
        setSelectedConfiguration: (state, action: PayloadAction<number | null>) => {
            state.selectedConfiguration = action.payload;
        },
        setCopiedItem: (state, action: PayloadAction<Item | null>) => {
            state.copiedItem = action.payload;
        },
        setPreviousTool: (state, action: PayloadAction<string | null>) => {
            state.previousTool = action.payload;
        },
        setHistory: (state, action: PayloadAction<HistoryAction[]>) => {
            state.history.actions = action.payload;
        },
        setHistoryIndex: (state, action: PayloadAction<number>) => {
            state.history.index = action.payload;
        },
        addToHistory: (state, action: PayloadAction<HistoryAction>) => {
            if (state.history.index < state.history.actions.length - 1) {
                state.history.actions.splice(state.history.index + 1);
            }
            state.history.actions.push(action.payload);
            state.history.index = state.history.actions.length - 1;
        },
        setIsAccountManagerOpen: (state, action: PayloadAction<boolean>) => {
            state.isAccountManagerOpen = action.payload;
        },
        setIsLibraryOpen: (state, action: PayloadAction<boolean>) => {
            state.isLibraryOpen = action.payload;
        },
        setIsCustomExportsOpen: (state, action: PayloadAction<boolean>) => {
            state.isCustomExportsOpen = action.payload;
        },
        setIsCustomTooltipsOpen: (state, action: PayloadAction<boolean>) => {
            state.isCustomTooltipsOpen = action.payload;
        },
        setCanvasZoom: (state, action: PayloadAction<number>) => {
            state.canvasZoom = action.payload;
        },
        addNotification: (state, action: PayloadAction<Notification>) => {
            notificationsAdapter.addOne(state.notifications, action.payload);
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            notificationsAdapter.removeOne(state.notifications, action.payload);
        },
        setIsSaved: (state, action: PayloadAction<'saved' | 'unsaved' | 'pending' | 'failure'>) => {
            state.isSaved = action.payload;
        },
        setIsUploaded: (state, action: PayloadAction<'saved' | 'unsaved' | 'pending' | 'failure'>) => {
            state.isUploaded = action.payload;
        },
    },
});

export const {
    setWorkspace,
    unsetWorkspace,
    setWorkspaces,
    unsetWorkspaces,
    addWorkspace,
    removeWorkspace,

    setBoard,
    updateBoard,
    unsetBoard,
    addItem,
    deleteItem,
    setAttachment,
    addAttachment,
    removeAttachment,
    setSelectedItem,
    setSelectedTool,
    setSelectedConfiguration,
    setCopiedItem,
    setPreviousTool,
    setHistory,
    setHistoryIndex,
    addToHistory,
    setItem,
    setItems,
    setIsAccountManagerOpen,
    setIsLibraryOpen,
    setIsCustomExportsOpen,
    setIsCustomTooltipsOpen,
    setCanvasZoom,
    addNotification,
    removeNotification,
    setIsSaved,
    setIsUploaded,
} = appSlice.actions;

export const {
    selectAll: selectAllWorkspaces,
    selectById: selectWorkspaceById,
    selectIds: selectWorkspaceIds,
} = workspacesAdapter.getSelectors<RootState>((state) => state.app.workspaces);

export const {
    selectAll: selectAllItems,
    selectById: selectItemById,
    selectIds: selectItemIds,
} = itemsAdapter.getSelectors<RootState>((state) => state.app.items);

export const {
    selectAll: selectAllNotifications,
    selectById: selectNotificationById,
    selectIds: selectNotificationIds,
} = notificationsAdapter.getSelectors<RootState>((state) => state.app.notifications);
