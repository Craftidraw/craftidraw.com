export interface MonacoThemeRule {
    token: string;
    foreground?: string;
    background?: string;
    fontStyle?: string;
}

export interface MonacoThemeColors {
    'editor.foreground'?: string;
    'editor.background'?: string;
    'editor.selectionBackground'?: string;
    'editor.lineHighlightBackground'?: string;
    'editorCursor.foreground'?: string;
    'editorWhitespace.foreground'?: string;
    [key: string]: string | undefined;
}

export interface MonacoTheme {
    base: 'vs' | 'vs-dark' | 'hc-black';
    inherit: boolean;
    rules: MonacoThemeRule[];
    colors: MonacoThemeColors;
}
