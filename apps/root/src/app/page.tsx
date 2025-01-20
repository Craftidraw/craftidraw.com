'use client';

import React, { useEffect, useState } from 'react';
import createCUID from '~/lib/cuid/createCUID';
import { useAppDispatch } from '~/lib/store/hooks';
import { setBoard, setItems, updateBoard } from '~/lib/store/features/appSlice';
import type { Board } from '~/types/board';
import type { Item } from '~/types/item';
import LocalBoardNavbar from '~/components/navbar/LocalBoardNavbar';
import BoardFooter from '~/components/footer/BoardFooter';
import OptionsBar from '~/components/ui/OptionsBar';
import NotificationAnchor from '~/components/ui/NotificationManagement';
import LibraryAnchor from '~/components/modal/anchors/LibraryAnchor';
import CustomExportsAnchor from '~/components/modal/anchors/CustomExportsAnchor';
import CustomTooltipsAnchor from '~/components/modal/anchors/CustomTooltipsAnchor';
import dynamic from 'next/dynamic';
import { StageProvider } from '~/providers/StageProvider';
import { fixItem, validateItem } from '~/lib/validate/validateItem';
import FadeComponent from '~/components/ui/FadeComponent';
import { DEFAULT_BOARD } from '~/utils/defaults';

const Canvas = dynamic(() => import('~/components/canvas/Canvas'), {
    ssr: false,
});

export default function Home() {
    const dispatch = useAppDispatch();
    const [boardLoaded, setBoardLoaded] = useState(false);
    const [itemsLoaded, setItemsLoaded] = useState(false);
    const isPopulated = boardLoaded && itemsLoaded;

    useEffect(() => {
        const storedBoard = localStorage.getItem('board');
        if (storedBoard) {
            const parsedBoard = JSON.parse(storedBoard) as Board;
            dispatch(updateBoard(parsedBoard));
            setBoardLoaded(true);
        } else {
            const board = {
                ...structuredClone(DEFAULT_BOARD),
                id: createCUID(),
            } as Board;
            localStorage.setItem('board', JSON.stringify(board));
            localStorage.setItem('items', JSON.stringify([]));
            dispatch(setBoard({ board: board, items: [] }));
            setBoardLoaded(true);
        }

        const storedItems = localStorage.getItem('items');
        if (storedItems) {
            const parsedItems = JSON.parse(storedItems);
            const processedItems: Item[] = [];

            for (const item of parsedItems) {
                const itemStr = JSON.stringify(item);
                const validatedItem = validateItem(itemStr);

                if (validatedItem.status) {
                    processedItems.push(validatedItem.item!);
                } else {
                    const fixedItem = fixItem(itemStr);
                    if (fixedItem) {
                        processedItems.push(fixedItem);
                    }
                }
            }

            localStorage.setItem('items', JSON.stringify(processedItems));
            dispatch(setItems(processedItems));
            setItemsLoaded(true);
        } else {
            localStorage.setItem('items', JSON.stringify([]));
            dispatch(setItems([]));
            setItemsLoaded(true);
        }
    }, []);

    if (!isPopulated) {
        return <div className='loader-container'>
            <div className='spinner-border' role='status'></div>
        </div>
    }

    return (
        <div id='board-page' style={{ overflow: 'hidden' }}>
            <StageProvider>
                <FadeComponent isLoading={!isPopulated}>
                    <div id='ui-wrapper'>
                        <LocalBoardNavbar />
                        <BoardFooter />
                    </div>
                    <OptionsBar />
                    <Canvas />
                    <NotificationAnchor />
                    <LibraryAnchor />
                    <CustomExportsAnchor />
                    <CustomTooltipsAnchor />
                </FadeComponent>
            </StageProvider>
        </div>
    );
}
