import type { TooltipSettings } from '~/types/item';
import React from 'react';

interface TooltipSnapshotProps {
    settings: TooltipSettings;
}

const TooltipPreview: React.FC<TooltipSnapshotProps> = ({ settings }) => {
    return (
        <div style={{ padding: '10px' }}>
            <div
                style={{
                    borderRadius: '5px',
                    borderColor: settings.isStokeEnabled ? settings.strokeColor : 'transparent',
                    borderStyle: settings.strokeStyle,
                    borderWidth: settings.strokeWidth,
                    backgroundColor: settings.isFillEnabled ? settings.fillColor : 'transparent',
                    color: settings.isFillEnabled ? 'white' : 'black',
                    height: '100px',
                    width: '150px',
                    textAlign: 'center',
                }}
            >
                Test Text
            </div>
        </div>
    );
};

export default TooltipPreview;
