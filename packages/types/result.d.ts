export interface QueryResult<T = boolean> {
    result: T;
    status: 'success' | 'error' | 'not_found' | 'unauthorized' | 'already_exists';
    message?: string;
}
