export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    required: boolean;
    accept?: {
        text: string;
        callbackId: string;
    };
    decline?: {
        text: string;
        callbackId: string;
    };
}
