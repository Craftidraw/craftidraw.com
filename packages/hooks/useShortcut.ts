import { useEffect } from 'react';
import type { RootState } from '~/lib/store/store';
import { useAppDispatch, useAppSelector } from '~/lib/store/hooks';
import {
    setPreviousTool,
    setSelectedTool,
} from '~/lib/store/features/appSlice';

export function useShortcut() {
    const dispatch = useAppDispatch();
    const selectedTool = useAppSelector((state: RootState) => state.app.selectedTool);
    const previousTool = useAppSelector((state: RootState) => state.app.previousTool);

    function useKeyPress(targetKey: string, handler: (event: KeyboardEvent) => void) {
        useEffect(() => {
            const keyHandler = (event: KeyboardEvent) => {
                const activeElement = document.activeElement;
                if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                    return;
                }

                event.preventDefault();
                if (event.key.toLowerCase() === targetKey.toLowerCase()) {
                    handler(event);
                }
            };

            window.addEventListener('keydown', keyHandler);
            return () => {
                window.removeEventListener('keydown', keyHandler);
            };
        }, [targetKey, handler]);
    }

    function useKeyRelease(targetKey: string, handler: (event: KeyboardEvent) => void) {
        useEffect(() => {
            const keyHandler = (event: KeyboardEvent) => {
                const activeElement = document.activeElement;
                if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                    return;
                }

                event.preventDefault();
                if (event.key.toLowerCase() === targetKey.toLowerCase()) {
                    handler(event);
                }
            };

            window.addEventListener('keyup', keyHandler);
            return () => {
                window.removeEventListener('keyup', keyHandler);
            };
        }, [targetKey, handler]);
    }

    function quickMoveDown() {
        dispatch(setPreviousTool(selectedTool));
        dispatch(setSelectedTool('move'));
    }

    function quickMoveUp() {
        if (!previousTool) return;
        dispatch(setSelectedTool(previousTool));
        dispatch(setPreviousTool(null));
    }

    return {
        useKeyPress,
        useKeyRelease,
        quickMoveDown,
        quickMoveUp,
    };
}
