import { type JwtPayload } from 'jsonwebtoken';
import { type Workspace } from './workspace';
import { type Board } from './board';
import { type Item } from './item';

export interface WorkspaceJwtPayload extends JwtPayload {
    plan: 'monthly' | 'yearly';
    seats: number;
    workspace: Workspace;
}

export interface UserJwtPayload extends JwtPayload {
    uuid: string;
}

export interface UserSQLPayload {
    uuid: string;
    username: string;
    full_name: string | null;
    email: string;
    claimed_trial: boolean;
    avatar_url: string | null;
    created_at: string;
}

export interface UserBoardsSQLPayload {
    user_uuid: string;
    board_uuid: string;
    workspace_uuid: string | null;
    mode: 'editor' | 'viewer' | 'commenter';
    accessed_at: string;
    joined_at: string;
    collection_id: number | null;
    source: 'workspace' | 'invite' | 'link' | 'public';
    board?: Board;
    items?: Item[];
}

export interface WorkspaceSQLPayload {
    workspace_uuid: string;
    user_uuid: string;
    joined_at: string;
    workspace: Workspace;
}

export interface CollectionsSQLPayload {
    id: number;
    name: string;
    order: number;
    user_uuid: string;
    workspace_uuid: string;
    boards?: Board[];
}
