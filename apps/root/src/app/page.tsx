'use client';

import React, { useEffect, useRef, useState } from 'react';
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
import type Konva from 'konva';
import dynamic from 'next/dynamic';
import { StageProvider } from '~/providers/StageProvider';
import { fixItem, validateItem } from '~/lib/validate/validateItem';
import Loader from '~/components/common/Loader';

const Canvas = dynamic(() => import('~/components/canvas/Canvas'), {
    ssr: false,
});

export default function Home() {
    const stageRef = useRef<Konva.Stage>(null);
    const dispatch = useAppDispatch();
    const [isPopulated, setIsPopulated] = useState(false);

    useEffect(() => {
        const storedBoard = localStorage.getItem('board');
        if (storedBoard) {
            const parsedBoard = JSON.parse(storedBoard) as Board;
            dispatch(updateBoard(parsedBoard));
        } else {
            const board = {
                id: createCUID(),
                name: 'New Board',
                enableGrid: true,
                snapToGrid: false,
                gridSpacing: 100,
                subGridSpacing: 20,
                snapIncrement: 5,
                showItems: false,
                theme: 'system',
                gridLineColor: '#000000',
                gridLineWidth: 1,
                gridLineOpacity: 0.1,
                gridSubLineColor: '#000000',
                gridSubLineWidth: 1,
                gridSubLineOpacity: 0.05,
                backgroundColor: '#ffffff',
            } as Board;
            localStorage.setItem('board', JSON.stringify(board));
            localStorage.setItem('items', JSON.stringify([]));
            dispatch(setBoard({ board: board, items: [] }));
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
        } else {
            localStorage.setItem('items', JSON.stringify([]));
            dispatch(setItems([]));
        }

        setIsPopulated(true);
    }, []);

    return (
        <div id='board-page' style={{ overflow: 'hidden' }}>
            <StageProvider>
                <div id='ui-wrapper'>
                    <LocalBoardNavbar />
                    <BoardFooter stageRef={stageRef} />
                </div>
                <OptionsBar />
                {isPopulated ? <Canvas /> : <Loader />}
                <NotificationAnchor />
                <LibraryAnchor />
                <CustomExportsAnchor />
                <CustomTooltipsAnchor />
            </StageProvider>
        </div>
    );
}
