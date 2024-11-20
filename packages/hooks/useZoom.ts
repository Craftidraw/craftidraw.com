import type React from 'react';
import { useEffect, useRef } from 'react';
import type Konva from 'konva';
import { setCanvasZoom } from '~/lib/store/features/appSlice';
import { useAppDispatch } from '~/lib/store/hooks';

interface ZoomConfig {
    minScale: number;
    maxScale: number;
    scaleBy: number;
    animationDuration: number;
}

export const useZoom = (
    stageRef: React.RefObject<Konva.Stage>,
    { minScale = 0.5, maxScale = 2, scaleBy = 1.2, animationDuration = 500 }: Partial<ZoomConfig> = {},
) => {
    const dispatch = useAppDispatch();

    const animating = useRef(false);
    const lastZoomTime = useRef(0);
    const accumulatedDelta = useRef(0);

    const animate = (
        start: number,
        end: number,
        startPos: { x: number; y: number },
        endPos: { x: number; y: number },
        startTime: number,
        duration: number,
    ) => {
        const stage = stageRef.current;
        if (!stage) return;

        const now = performance.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
        const easedProgress = easeOutCubic(progress);

        const currentScale = start + (end - start) * easedProgress;
        const currentX = startPos.x + (endPos.x - startPos.x) * easedProgress;
        const currentY = startPos.y + (endPos.y - startPos.y) * easedProgress;

        stage.scale({ x: currentScale, y: currentScale });
        stage.position({ x: currentX, y: currentY });
        stage.batchDraw();

        if (progress < 1) {
            requestAnimationFrame(() => animate(start, end, startPos, endPos, startTime, duration));
        } else {
            animating.current = false;
        }
    };

    const handleZoom = (e: Konva.KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const stage = stageRef.current;
        if (!stage || animating.current) return;

        const now = performance.now();
        const timeDelta = now - lastZoomTime.current;
        lastZoomTime.current = now;

        // Accumulate small deltas for smoother zooming
        accumulatedDelta.current += e.evt.deltaY;

        // If the time between wheel events is too large, reset accumulation
        if (timeDelta > 150) {
            accumulatedDelta.current = e.evt.deltaY;
        }

        // Only proceed if accumulated delta is significant
        if (Math.abs(accumulatedDelta.current) < 10) return;

        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        if (!pointer) return;

        const mousePointTo = {
            x: pointer.x / oldScale - stage.x() / oldScale,
            y: pointer.y / oldScale - stage.y() / oldScale,
        };

        const zoomDirection = accumulatedDelta.current < 0 ? 1 : -1;
        const newScale = oldScale * Math.pow(scaleBy, zoomDirection);
        const roundedNewScale = Math.round(newScale * 1000) / 1000;

        // Check zoom bounds
        if (roundedNewScale > maxScale || roundedNewScale < minScale) {
            accumulatedDelta.current = 0;
            return;
        }

        const newPos = {
            x: -(mousePointTo.x - pointer.x / roundedNewScale) * roundedNewScale,
            y: -(mousePointTo.y - pointer.y / roundedNewScale) * roundedNewScale,
        };

        // Round positions to avoid subpixel rendering
        newPos.x = Math.round(newPos.x * 100) / 100;
        newPos.y = Math.round(newPos.y * 100) / 100;

        animating.current = true;
        accumulatedDelta.current = 0;

        dispatch(setCanvasZoom(roundedNewScale));

        // Start the animation
        animate(oldScale, roundedNewScale, stage.position(), newPos, now, animationDuration);
    };

    // Clean up function
    useEffect(() => {
        return () => {
            animating.current = false;
            accumulatedDelta.current = 0;
            lastZoomTime.current = 0;
        };
    }, []);

    return handleZoom;
};
