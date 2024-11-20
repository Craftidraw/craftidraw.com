import type { Tooltip } from '~/types/item';
import React from 'react';

interface TooltipSnapshotProps {
    tooltip: Tooltip;
}

const TooltipPreview: React.FC<TooltipSnapshotProps> = ({ tooltip }) => {
    return (
        <div style={{ padding: '10px' }}>
            <div
                style={{
                    borderRadius: '5px',
                    borderColor: tooltip.isStokeEnabled ? tooltip.strokeColor : 'transparent',
                    borderStyle: tooltip.strokeStyle,
                    borderWidth: tooltip.strokeWidth,
                    backgroundColor: tooltip.isFillEnabled ? tooltip.fillColor : 'transparent',
                    color: tooltip.isFillEnabled ? 'white' : 'black',
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
