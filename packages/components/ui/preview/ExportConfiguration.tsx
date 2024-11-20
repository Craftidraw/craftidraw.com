import React from 'react';
import Image from 'next/image';
import type { RootState } from '~/lib/store/store';
import type { LibraryExportConfiguration } from '~/types/library';
import { useAppSelector } from '~/lib/store/hooks';
import codeJson from '~/assets/code/code-json.svg';
import codeYaml from '~/assets/code/alpha-y-box-outline.svg';
import codeJava from '~/assets/code/language-java.svg';
import codeCsharp from '~/assets/code/language-csharp.svg';
import codeCpp from '~/assets/code/language-cpp.svg';
import codeLua from '~/assets/code/language-lua.svg';
import codeJs from '~/assets/code/language-javascript.svg';
import codePy from '~/assets/code/language-python.svg';
import codeDefault from '~/assets/code/script-text.svg';

interface ExportConfigurationProps {
    configuration: LibraryExportConfiguration;
    selectedConfigurationInModal: LibraryExportConfiguration | null;
    setSelectedConfigurationInModal: (configuration: LibraryExportConfiguration | null) => void;
}

const fileTypeToImageMap = {
    json: codeJson as string,
    yml: codeYaml as string,
    java: codeJava as string,
    cs: codeCsharp as string,
    cpp: codeCpp as string,
    lua: codeLua as string,
    js: codeJs as string,
    py: codePy as string,
    default: codeDefault as string,
} as const;

const ExportConfiguration: React.FC<ExportConfigurationProps> = ({
    configuration,
    selectedConfigurationInModal,
    setSelectedConfigurationInModal,
}) => {
    const selectedConfiguration = useAppSelector((state: RootState) => state.app.selectedConfiguration);

    const formatBytes = (bytes: number): string => {
        const sizes = ['Bytes', 'KB', 'MB'];
        if (bytes === 0) return '0 Bytes';

        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        const formattedSize = parseFloat((bytes / Math.pow(1024, i)).toFixed(2));

        return `${formattedSize} ${sizes[i]}`;
    };

    const applyHighlight = (): string => {
        if (configuration.id === selectedConfiguration) {
            return ' registered';
        } else if (configuration.id === selectedConfigurationInModal?.id) {
            return ' selected';
        }
        return '';
    };

    const getFileIcon = (fileName: string): string => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        return fileTypeToImageMap[extension as keyof typeof fileTypeToImageMap] || fileTypeToImageMap.default;
    };

    return (
        <div
            className='d-flex col-3 library-configuration'
            onClick={() => setSelectedConfigurationInModal(configuration)}
        >
            <div className={`d-flex flex-column align-items-center library-configuration-container${applyHighlight()}`}>
                <div className='library-configuration-image-container'>
                    <Image
                        src={getFileIcon(configuration.file.name)}
                        alt={`${configuration.file.name} icon`}
                        width={50}
                        height={50}
                        priority={false}
                        style={{ objectFit: 'contain' }}
                    />
                </div>
                <div
                    className='d-flex flex-column library-configuration-details'
                    style={{ width: '100%', height: '100%' }}
                >
                    <div className='mt-auto'>
                        <h6>{configuration.file.name}</h6>
                        <small>{formatBytes(configuration.file.size)}</small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExportConfiguration;
