import React from 'react';
import type { RootState } from '~/lib/store/store';
import { Button, ButtonGroup, Card } from 'react-bootstrap';
import type Konva from 'konva';
import type { DrawItem, Item, LineItem } from '~/types/item';
import type { Board } from '~/types/board';
import { useAppDispatch, useAppSelector } from '~/lib/store/hooks';
import { selectAllItems, setCanvasZoom, setSelectedItem, updateBoard } from '~/lib/store/features/appSlice';

interface UIFooterProps {
    stageRef: React.RefObject<Konva.Stage>;
}

const BoardFooter: React.FC<UIFooterProps> = ({ stageRef }) => {
    const dispatch = useAppDispatch();
    const board: Board = useAppSelector((state: RootState) => state.app.board);
    const items: Item[] = useAppSelector(selectAllItems);
    const canvasZoom = useAppSelector((state: RootState) => state.app.canvasZoom);

    const handleSelect = (item: Item) => {
        dispatch(setSelectedItem(item.id));

        if (stageRef.current) {
            const stage = stageRef.current;
            let x: number, y: number;

            if (item.type === 'line' || item.type === 'arrow') {
                const line = item as LineItem;
                if(!line.points || line.points.length < 4) return
                x = (line.points[0]! + line.points[2]!) / 2;
                y = (line.points[1]! + line.points[3]!) / 2;
            } else if (item.type === 'draw') {
                const midpoint = (item as DrawItem).points.length / 2;
                x = (item as DrawItem).points[midpoint]!;
                y = (item as DrawItem).points[midpoint + 1]!;
            } else {
                x = item.position.x;
                y = item.position.y;
            }

            // Calculate new position to center the item
            const newPos = {
                x: -x * canvasZoom + stage.width() / 2,
                y: -y * canvasZoom + stage.height() / 2,
            };

            // Animate the stage to the new position
            stage.to({
                x: newPos.x,
                y: newPos.y,
                duration: 0.1,
            });
        }
    };

    const handleItems = (): JSX.Element[] => {
        return items.map((item, index) => (
            <>
                <Card
                    key={item.id + 'map'}
                    className='d-flex item-card'
                    style={{ flexDirection: 'row', display: 'block', border: 'none' }}
                    onClick={() => handleSelect(item)}
                >
                    <Card.Body style={{ paddingTop: '5px', paddingBottom: '5px' }}>
                        <h6>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</h6>
                        <Card.Text>
                            {item.type === 'line' || item.type === 'arrow' ? (
                                <>
                                    [{Math.round((item as LineItem).points[0]! * 100) / 100},{' '}
                                    {(-1 * Math.round((item as LineItem).points[1]! * 100)) / 100}] -{'>'} [
                                    {Math.round((item as LineItem).points[2]! * 100) / 100},{' '}
                                    {(-1 * Math.round((item as LineItem).points[3]! * 100)) / 100}]
                                </>
                            ) : (
                                <>
                                    X: {Math.round(item.position.x * 100) / 100}, Y: {-1 * (Math.round(item.position.y * 100) / 100)}
                                </>
                            )}
                        </Card.Text>
                    </Card.Body>
                </Card>
                {items.length > index + 1 && (
                    <hr key={'hr' + index} style={{ marginTop: '5px', marginBottom: '5px', opacity: '0.1' }} />
                )}
            </>
        ));
    };

    return (
        <footer className='d-flex footer-container' style={{ pointerEvents: 'none' }}>
            <Button
                variant='primary'
                style={{ maxHeight: '35px', marginTop: 'auto', pointerEvents: 'auto' }}
                onClick={() => dispatch(updateBoard({ ...board, showItems: !board?.showItems }))}
            >
                <i className='fa-solid fa-list'></i>
            </Button>
            {board.showItems && (
                <div className='d-flex flex-column items-bar-container' style={{ pointerEvents: 'auto' }}>
                    {handleItems()}
                </div>
            )}
            <div className='d-flex flex-column ms-auto'>
                <ButtonGroup style={{ pointerEvents: 'auto' }}>
                    <Button
                        variant='primary'
                        onClick={() => {
                            if (stageRef.current) {
                                const stage = stageRef.current;
                                const scaleBy = 1.05;
                                const oldScale = stage.scaleX();
                                const maxScale = 2;

                                const newScale = oldScale * scaleBy;

                                // Round the new scale to avoid accumulating small errors
                                const roundedNewScale = Math.round(newScale * 1000) / 1000;
                                if (roundedNewScale > maxScale || roundedNewScale < 0.5) return;
                                stage.scale({ x: newScale, y: newScale });

                                stage.batchDraw();
                                dispatch(setCanvasZoom(newScale));
                            }
                        }}
                    >
                        <i className='fa-solid fa-plus'></i>
                    </Button>
                    <Button id='btn-zoom' variant='primary' disabled={true}>
                        {' '}
                        {Math.round(canvasZoom * 100 * 10) / 10}%{' '}
                    </Button>
                    <Button
                        variant='primary'
                        onClick={() => {
                            if (stageRef.current) {
                                const stage = stageRef.current;
                                const scaleBy = 1 / 1.05;
                                const oldScale = stage.scaleX();
                                const maxScale = 2;

                                const newScale = oldScale * scaleBy;

                                // Round the new scale to avoid accumulating small errors
                                const roundedNewScale = Math.round(newScale * 1000) / 1000;
                                if (roundedNewScale > maxScale || roundedNewScale < 0.5) return;
                                stage.scale({ x: newScale, y: newScale });

                                stage.batchDraw();
                                dispatch(setCanvasZoom(newScale));
                            }
                        }}
                    >
                        <i className='fa-solid fa-minus'></i>
                    </Button>
                </ButtonGroup>
            </div>
        </footer>
    );
};

export default BoardFooter;
