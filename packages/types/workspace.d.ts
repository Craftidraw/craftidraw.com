export interface WorkspaceShell {
    id: string;
    name: string;
}

export interface Workspace {
    id: string;
    name: string;
    billing_id: string;
    type: 'solo' | 'team';
    subscription_id: string | null | undefined;
    owner_id: string;
    seats: number;
    created_at: Date | string;
    members: WorkspaceMember[];
    roles: WorkspaceRole[];
}

export interface WorkspaceMember {
    workspace_id: string;
    user_id: string;
    name: string | null;
    username: string;
    email: string;
    joined_at: Date;
    roles: number[];
}

export interface WorkspaceRole {
    id: number;
    name: string;
    color: string;
    handle: string;
    order: number;
    permissions: WorkspacePermission[];
    workspace_id: number;
}

export interface WorkspacePermission {
    id: number;
    name: string;
    description: string;
    key: WorkspacePermissionKey;
    granted: boolean;
}

export enum WorkspacePermissionKey {
    VIEW_WORKSPACE = 'VIEW_WORKSPACE',
    EDIT_WORKSPACE = 'EDIT_WORKSPACE',
    DELETE_WORKSPACE = 'DELETE_WORKSPACE',

    VIEW_USERS = 'VIEW_USERS',
    INVITE_USERS = 'INVITE_USERS',
    REMOVE_USERS = 'REMOVE_USERS',
    MANAGE_USER_ROLES = 'MANAGE_USER_ROLES',

    VIEW_TEAMS = 'VIEW_TEAMS',
    CREATE_TEAMS = 'CREATE_TEAMS',
    EDIT_TEAMS = 'EDIT_TEAMS',
    DELETE_TEAMS = 'DELETE_TEAMS',

    VIEW_ROLES = 'VIEW_ROLES',
    CREATE_ROLES = 'CREATE_ROLES',
    EDIT_ROLES = 'EDIT_ROLES',
    DELETE_ROLES = 'DELETE_ROLES',

    VIEW_BOARDS = 'VIEW_BOARDS',
    CREATE_BOARDS = 'CREATE_BOARDS',
    EDIT_BOARDS = 'EDIT_BOARDS',
    DELETE_BOARDS = 'DELETE_BOARDS',
    SHARE_BOARDS = 'SHARE_BOARDS',

    MANAGE_IMAGES = 'MANAGE_IMAGES',
    MANAGE_ITEMS = 'MANAGE_ITEMS',
    MANAGE_EXPORTS = 'MANAGE_EXPORTS',
    MANAGE_TOOLTIPS = 'MANAGE_TOOLTIPS',

    VIEW_COLLECTIONS = 'VIEW_COLLECTIONS',
    CREATE_COLLECTIONS = 'CREATE_COLLECTIONS',
    EDIT_COLLECTIONS = 'EDIT_COLLECTIONS',
    DELETE_COLLECTIONS = 'DELETE_COLLECTIONS',

    MANAGE_SECURITY = 'MANAGE_SECURITY',
    VIEW_AUDIT_LOGS = 'VIEW_AUDIT_LOGS',
    MANAGE_TRASH = 'MANAGE_TRASH',

    VIEW_BILLING = 'VIEW_BILLING',
    MANAGE_SUBSCRIPTION = 'MANAGE_SUBSCRIPTION',

    MANAGE_NOTIFICATIONS = 'MANAGE_NOTIFICATIONS',

    MANAGE_API = 'MANAGE_API',
    MANAGE_APPS = 'MANAGE_APPS',
    MANAGE_WEBHOOKS = 'MANAGE_WEBHOOKS',
    MANAGE_COPILOT = 'MANAGE_COPILOT',

    MANAGE_INTEGRATIONS = 'MANAGE_INTEGRATIONS',
}

export const WORKSPACE_ROLE_PERMISSIONS: WorkspacePermission[] = [
    // Workspace Management
    {
        id: 1,
        name: 'View Workspace',
        description: 'Can view workspace details',
        key: WorkspacePermissionKey.WORKSPACE_VIEW,
    },
    {
        id: 2,
        name: 'Edit Workspace',
        description: 'Can edit workspace settings',
        key: WorkspacePermissionKey.WORKSPACE_EDIT,
    },
    {
        id: 3,
        name: 'Delete Workspace',
        description: 'Can delete the workspace',
        key: WorkspacePermissionKey.WORKSPACE_DELETE,
    },

    // User Management
    {
        id: 4,
        name: 'View Users',
        description: 'Can view workspace users',
        key: WorkspacePermissionKey.WORKSPACE_VIEW_USERS,
    },
    {
        id: 5,
        name: 'Invite Users',
        description: 'Can invite new members to the workspace',
        key: WorkspacePermissionKey.WORKSPACE_INVITE_USERS,
    },
    {
        id: 6,
        name: 'Remove Users',
        description: 'Can remove members from the workspace',
        key: WorkspacePermissionKey.WORKSPACE_REMOVE_USERS,
    },
    {
        id: 7,
        name: 'Manage User Roles',
        description: 'Can assign or change member roles',
        key: WorkspacePermissionKey.WORKSPACE_MANAGE_USER_ROLES,
    },

    // Team Management
    {
        id: 8,
        name: 'View Teams',
        description: 'Can view teams in the workspace',
        key: WorkspacePermissionKey.WORKSPACE_VIEW_TEAMS,
    },
    {
        id: 9,
        name: 'Create Teams',
        description: 'Can create teams in the workspace',
        key: WorkspacePermissionKey.WORKSPACE_CREATE_TEAMS,
    },
    {
        id: 10,
        name: 'Edit Teams',
        description: 'Can edit team details and members',
        key: WorkspacePermissionKey.WORKSPACE_EDIT_TEAMS,
    },
    {
        id: 11,
        name: 'Delete Teams',
        description: 'Can delete teams from the workspace',
        key: WorkspacePermissionKey.WORKSPACE_DELETE_TEAMS,
    },

    // Role Management
    {
        id: 12,
        name: 'View Roles',
        description: 'Can view roles in the workspace',
        key: WorkspacePermissionKey.WORKSPACE_VIEW_ROLES,
    },
    {
        id: 13,
        name: 'Create Roles',
        description: 'Can create new roles in the workspace',
        key: WorkspacePermissionKey.WORKSPACE_CREATE_ROLES,
    },
    {
        id: 14,
        name: 'Edit Roles',
        description: 'Can edit existing roles in the workspace',
        key: WorkspacePermissionKey.WORKSPACE_EDIT_ROLES,
    },
    {
        id: 15,
        name: 'Delete Roles',
        description: 'Can delete roles from the workspace',
        key: WorkspacePermissionKey.WORKSPACE_DELETE_ROLES,
    },

    // Board Management
    {
        id: 16,
        name: 'View Boards',
        description: 'Can view boards in the workspace',
        key: WorkspacePermissionKey.WORKSPACE_VIEW_BOARDS,
    },
    {
        id: 17,
        name: 'Create Boards',
        description: 'Can create boards in the workspace',
        key: WorkspacePermissionKey.WORKSPACE_CREATE_BOARDS,
    },
    {
        id: 18,
        name: 'Edit Boards',
        description: 'Can edit boards in the workspace',
        key: WorkspacePermissionKey.WORKSPACE_EDIT_BOARDS,
    },
    {
        id: 19,
        name: 'Delete Boards',
        description: 'Can delete boards in the workspace',
        key: WorkspacePermissionKey.WORKSPACE_DELETE_BOARDS,
    },
    {
        id: 20,
        name: 'Share Boards',
        description: 'Can share boards with other members or teams',
        key: WorkspacePermissionKey.WORKSPACE_SHARE_BOARDS,
    },

    // Library Management
    {
        id: 21,
        name: 'Manage Images',
        description: 'Can manage workspace images',
        key: WorkspacePermissionKey.WORKSPACE_MANAGE_IMAGES,
    },
    {
        id: 22,
        name: 'Manage Items',
        description: 'Can manage workspace items',
        key: WorkspacePermissionKey.WORKSPACE_MANAGE_ITEMS,
    },
    {
        id: 23,
        name: 'Manage Exports',
        description: 'Can manage workspace exports',
        key: WorkspacePermissionKey.WORKSPACE_MANAGE_EXPORTS,
    },
    {
        id: 24,
        name: 'Manage Tooltips',
        description: 'Can manage workspace tooltips',
        key: WorkspacePermissionKey.WORKSPACE_MANAGE_TOOLTIPS,
    },

    // Collection Management
    {
        id: 25,
        name: 'View Collections',
        description: 'Can view collections in the workspace',
        key: WorkspacePermissionKey.WORKSPACE_VIEW_COLLECTIONS,
    },
    {
        id: 26,
        name: 'Create Collections',
        description: 'Can create collections in the workspace',
        key: WorkspacePermissionKey.WORKSPACE_CREATE_COLLECTIONS,
    },
    {
        id: 27,
        name: 'Edit Collections',
        description: 'Can edit collections in the workspace',
        key: WorkspacePermissionKey.WORKSPACE_EDIT_COLLECTIONS,
    },
    {
        id: 28,
        name: 'Delete Collections',
        description: 'Can delete collections in the workspace',
        key: WorkspacePermissionKey.WORKSPACE_DELETE_COLLECTIONS,
    },

    // Administration
    {
        id: 29,
        name: 'Manage Security',
        description: 'Can manage workspace security settings',
        key: WorkspacePermissionKey.WORKSPACE_MANAGE_SECURITY,
    },
    {
        id: 30,
        name: 'View Audit Logs',
        description: 'Can view workspace activity logs',
        key: WorkspacePermissionKey.WORKSPACE_VIEW_AUDIT_LOGS,
    },
    {
        id: 31,
        name: 'Manage Trash',
        description: 'Can manage workspace trash',
        key: WorkspacePermissionKey.WORKSPACE_MANAGE_TRASH,
    },

    // Billing and Subscription
    {
        id: 32,
        name: 'View Billing',
        description: 'Can view billing information and invoices',
        key: WorkspacePermissionKey.WORKSPACE_VIEW_BILLING,
    },
    {
        id: 33,
        name: 'Manage Subscription',
        description: 'Can change subscription plans and payment methods',
        key: WorkspacePermissionKey.WORKSPACE_MANAGE_SUBSCRIPTION,
    },

    // Notifications
    {
        id: 34,
        name: 'Manage Notifications',
        description: 'Can manage workspace-wide notification settings',
        key: WorkspacePermissionKey.WORKSPACE_MANAGE_NOTIFICATIONS,
    },

    // Developer Features (for future use)
    {
        id: 35,
        name: 'Manage API',
        description: 'Can manage API settings',
        key: WorkspacePermissionKey.WORKSPACE_MANAGE_API,
    },
    {
        id: 36,
        name: 'Manage Apps',
        description: 'Can manage workspace apps',
        key: WorkspacePermissionKey.WORKSPACE_MANAGE_APPS,
    },
    {
        id: 37,
        name: 'Manage Webhooks',
        description: 'Can manage workspace webhooks',
        key: WorkspacePermissionKey.WORKSPACE_MANAGE_WEBHOOKS,
    },
    {
        id: 38,
        name: 'Manage Copilot',
        description: 'Can manage Copilot settings',
        key: WorkspacePermissionKey.WORKSPACE_MANAGE_COPILOT,
    },

    // Integrations
    {
        id: 39,
        name: 'Manage Integrations',
        description: 'Can manage workspace integrations',
        key: WorkspacePermissionKey.WORKSPACE_MANAGE_INTEGRATIONS,
    },
];
