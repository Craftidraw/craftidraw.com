'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Layer, Line } from 'react-konva';
import type { RootState } from '~/lib/store/store';
import { useAppSelector } from '~/lib/store/hooks';

interface GridProps {
    stagePos: { x: number; y: number };
}

const GridLayer: React.FC<GridProps> = ({ stagePos }) => {
    const board = useAppSelector((state: RootState) => state.app.board);
    const zoom = useAppSelector((state: RootState) => state.app.canvasZoom);
    const gridStep = board.gridSpacing;
    const subGridStep = board.subGridSpacing;
    const color = board.gridLineColor ?? '#808080';
    const subColor = board.gridSubLineColor ?? '#808080';
    const [viewport, setViewport] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateSize = () => {
            setViewport({ width: window.innerWidth, height: window.innerHeight });
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const lines = useMemo(() => {
        const newLines: JSX.Element[] = [];

        const visibleWidth = viewport.width / zoom;
        const visibleHeight = viewport.height / zoom;

        const buffer = Math.max(visibleWidth, visibleHeight) * 2;

        const startX = Math.floor((-stagePos.x / zoom - buffer) / gridStep) * gridStep;
        const endX = Math.ceil((-stagePos.x / zoom + visibleWidth + buffer) / gridStep) * gridStep;
        const startY = Math.floor((-stagePos.y / zoom - buffer) / gridStep) * gridStep;
        const endY = Math.ceil((-stagePos.y / zoom + visibleHeight + buffer) / gridStep) * gridStep;

        for (let x = startX; x <= endX; x += gridStep) {
            newLines.push(
                <Line
                    key={`main-v-${x}`}
                    points={[x, startY, x, endY]}
                    stroke={color}
                    strokeWidth={board.gridLineWidth / zoom}
                    opacity={board.gridLineOpacity}
                />,
            );
        }

        for (let y = startY; y <= endY; y += gridStep) {
            newLines.push(
                <Line
                    key={`main-h-${y}`}
                    points={[startX, y, endX, y]}
                    stroke={color}
                    strokeWidth={board.gridLineWidth / zoom}
                    opacity={board.gridLineOpacity}
                />,
            );
        }

        for (let x = startX; x <= endX; x += subGridStep) {
            if (x % gridStep !== 0) {
                newLines.push(
                    <Line
                        key={`sub-v-${x}`}
                        points={[x, startY, x, endY]}
                        stroke={subColor}
                        strokeWidth={board.gridSubLineWidth / zoom}
                        opacity={board.gridSubLineOpacity}
                        dashEnabled={true}
                        dash={[6, 6]}
                    />,
                );
            }
        }

        for (let y = startY; y <= endY; y += subGridStep) {
            if (y % gridStep !== 0) {
                newLines.push(
                    <Line
                        key={`sub-h-${y}`}
                        points={[startX, y, endX, y]}
                        stroke={subColor}
                        strokeWidth={board.gridSubLineWidth / zoom}
                        opacity={board.gridSubLineOpacity}
                        dashEnabled={true}
                        dash={[6, 6]}
                    />,
                );
            }
        }

        return newLines;
    }, [viewport.width, viewport.height, zoom, stagePos.x, stagePos.y, gridStep, color, board.gridLineWidth, board.gridLineOpacity, board.gridSubLineWidth, board.gridSubLineOpacity, subGridStep, subColor]);

    return <Layer listening={false}>{lines}</Layer>;
};

export default GridLayer;
