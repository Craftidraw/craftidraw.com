export const saveCustomFile = async (filename: string, data: string, mimeType: string, extension: string) => {
    if ('showSaveFilePicker' in window && window.showSaveFilePicker) {
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: filename,
                types: [
                    {
                        description: 'Custom File',
                        accept: {
                            [mimeType]: [extension],
                        },
                    },
                ],
            });

            const writable = await handle.createWritable();
            await writable.write(data);
            await writable.close();
        } catch (err) {
            console.error('File Save Error:', err);
            throw err;
        }
    } else {
        const blob = new Blob([data], { type: mimeType });
        saveFile(`${filename}${extension}`, blob, mimeType);
    }
};

export const saveFile = (filename: string, data: Blob, mimeType: string) => {
    const file = new File([data], filename, { type: mimeType });
    const a = document.createElement('a');
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    a.click();

    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
};

export const uploadCustomFile = async (mimeType: string, extension: string) => {
    if ('showOpenFilePicker' in window && window.showOpenFilePicker) {
        try {
            const [handle] = await window.showOpenFilePicker({
                types: [
                    {
                        description: 'Custom File',
                        accept: {
                            [mimeType]: [extension],
                        },
                    },
                ],
            });
            return await handle.getFile();
        } catch (err) {
            console.error('File Upload Error:', err);
            throw err;
        }
    } else {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = extension; // Use extension directly
        input.style.display = 'none';
        document.body.appendChild(input);

        return new Promise<File>((resolve, reject) => {
            input.onchange = () => {
                const file = input.files?.[0];
                if (file) {
                    resolve(file);
                } else {
                    reject(new Error('No file selected.'));
                }
                document.body.removeChild(input);
            };
            input.click();
        });
    }
};

export const uploadFile = (mimeTypes: string[]) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = mimeTypes.join(', ');
    input.style.display = 'none';
    document.body.appendChild(input);

    return new Promise<File>((resolve, reject) => {
        input.onchange = () => {
            const file = input.files?.[0];
            if (file) {
                // Validate file type
                if (!mimeTypes.includes(file.type)) {
                    reject(new Error('File type does not match.'));
                } else {
                    resolve(file);
                }
            } else {
                reject(new Error('No file selected.'));
            }
            document.body.removeChild(input);
        };
        input.click();
    });
};
