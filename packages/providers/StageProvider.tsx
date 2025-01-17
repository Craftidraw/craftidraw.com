import React, { createContext, useContext, useRef, useCallback, type RefObject } from 'react';
import type Konva from 'konva';

interface StageContextType {
    stageRef: RefObject<Konva.Stage>;
    transformerRef: RefObject<Konva.Transformer>;
    tooltipTransformerRef: RefObject<Konva.Transformer>;
    itemLayerRef: RefObject<Konva.Layer>;
    getRelativePointerPosition: () => { x: number; y: number } | null;
    getStageScale: () => number;
}

const StageContext = createContext<StageContextType | null>(null);

export const StageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const stageRef = useRef<Konva.Stage>(null);
    const transformerRef = useRef<Konva.Transformer>(null);
    const tooltipTransformerRef = useRef<Konva.Transformer>(null);
    const itemLayerRef = useRef<Konva.Layer>(null);

    const getRelativePointerPosition = useCallback(() => {
        if (!stageRef.current) return null;
        return stageRef.current.getRelativePointerPosition();
    }, []);

    const getStageScale = useCallback(() => {
        if (!stageRef.current) return 1;
        return stageRef.current.scaleX();
    }, []);

    const value = {
        stageRef,
        transformerRef,
        tooltipTransformerRef,
        itemLayerRef,
        getRelativePointerPosition,
        getStageScale,
    };

    return (
        <StageContext.Provider value={value}>
            {children}
        </StageContext.Provider>
    );
};

export const useStage = () => {
    const context = useContext(StageContext);
    if (!context) {
        throw new Error('useStage must be used within a StageProvider');
    }
    return context;
};