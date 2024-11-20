import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { filename: string } }) {
    try {
        const { filename } = params;

        const projectRoot = process.cwd().split('apps')[0]!;

        const templatesDir = path.join(projectRoot, 'packages', 'assets', 'templates', 'configuration');

        try {
            await fs.access(templatesDir);
        } catch (e) {
            return NextResponse.json({ error: 'Templates directory not found' }, { status: 404 });
        }

        const filePath = path.join(templatesDir, filename);

        if (!filePath.startsWith(templatesDir)) {
            return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
        }

        const fileContents = await fs.readFile(filePath, 'utf8');
        const ext = path.extname(filename);
        const contentType = getContentType(ext);

        return new NextResponse(fileContents, {
            headers: {
                'Content-Type': contentType,
            },
        });
    } catch {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }
}

function getContentType(extension: string): string {
    const contentTypes: Record<string, string> = {
        '.cs': 'text/x-csharp',
        '.cpp': 'text/x-c++src',
        '.json': 'application/json',
        '.yml': 'text/yaml',
        '.java': 'text/x-java',
        '.lua': 'text/x-lua',
        '.js': 'text/javascript',
        '.py': 'text/x-python',
        '.txt': 'text/plain',
    };

    return contentTypes[extension] ?? 'text/plain';
}
