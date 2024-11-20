import React from 'react';
import type { RootState } from '~/lib/store/store';
import { useAppDispatch, useAppSelector } from '~/lib/store/hooks';
import { setSelectedTool } from '~/lib/store/features/appSlice';
import { Button } from 'react-bootstrap';

const BoardToolbar = () => {
    const dispatch = useAppDispatch();

    const selectedTool = useAppSelector((state: RootState) => state.app.selectedTool);

    return (
        <div className='d-flex tools-container' style={{ alignSelf: 'center', marginLeft: '15px' }}>
            <div className='button-group' id='tools'>
                <Button
                    title='Move Tool - 0'
                    variant='tools'
                    active={selectedTool === 'move'}
                    onClick={() => dispatch(setSelectedTool('move'))}
                >
                    <i className='fa-solid fa-up-down-left-right'></i>
                    <span className='nav-tool-span'>0</span>
                </Button>
                <Button
                    title='Pointer Tool - 1'
                    variant='tools'
                    active={selectedTool === 'pointer'}
                    onClick={() => dispatch(setSelectedTool('pointer'))}
                >
                    <i className='fa-solid fa-arrow-pointer'></i>
                    <span className='nav-tool-span'>1</span>
                </Button>
                <Button
                    title='Custom Item Tool - 2'
                    variant='tools'
                    active={selectedTool === 'custom'}
                    onClick={() => dispatch(setSelectedTool('custom'))}
                >
                    <i className='fa-solid fa-cube'></i>
                    <span className='nav-tool-span'>2</span>
                </Button>
                <Button
                    title='Circle Tool - 3'
                    variant='tools'
                    active={selectedTool === 'circle'}
                    onClick={() => dispatch(setSelectedTool('circle'))}
                >
                    <i className='fa-solid fa-circle'></i>
                    <span className='nav-tool-span'>3</span>
                </Button>
                <Button
                    title='Rectangle Tool - 4'
                    variant='tools'
                    active={selectedTool === 'rectangle'}
                    onClick={() => dispatch(setSelectedTool('rectangle'))}
                >
                    <i className='fa-solid fa-square'></i>
                    <span className='nav-tool-span'>4</span>
                </Button>
                <Button
                    title='Diamond Tool - 5'
                    variant='tools'
                    active={selectedTool === 'diamond'}
                    onClick={() => dispatch(setSelectedTool('diamond'))}
                >
                    <i className='fa-solid fa-diamond'></i>
                    <span className='nav-tool-span'>5</span>
                </Button>
                <Button
                    title='Line Tool - 6'
                    variant='tools'
                    active={selectedTool === 'line'}
                    onClick={() => dispatch(setSelectedTool('line'))}
                >
                    <i className='fa-solid fa-minus'></i>
                    <span className='nav-tool-span'>6</span>
                </Button>
                <Button
                    title='Arrow Tool - 7'
                    variant='tools'
                    active={selectedTool === 'arrow'}
                    onClick={() => dispatch(setSelectedTool('arrow'))}
                >
                    <i className='fa-solid fa-right-long'></i>
                    <span className='nav-tool-span'>7</span>
                </Button>
                <Button
                    title='Image Tool - 8'
                    variant='tools'
                    active={selectedTool === 'image'}
                    onClick={() => dispatch(setSelectedTool('image'))}
                >
                    <i className='fa-solid fa-image'></i>
                    <span className='nav-tool-span'>8</span>
                </Button>
                <Button
                    title='Text Tool - 9'
                    variant='tools'
                    active={selectedTool === 'text'}
                    onClick={() => dispatch(setSelectedTool('text'))}
                >
                    <i className='fa-solid fa-t'></i>
                    <span className='nav-tool-span'>9</span>
                </Button>
                <Button
                    title='Draw Tool - 10'
                    variant='tools'
                    active={selectedTool === 'draw'}
                    onClick={() => dispatch(setSelectedTool('draw'))}
                >
                    <i className='fa-solid fa-pen'></i>
                    <span className='nav-tool-span'>10</span>
                </Button>
                <Button
                    title='Eraser Tool - 11'
                    variant='tools'
                    active={selectedTool === 'eraser'}
                    disabled={true}
                    onClick={() => dispatch(setSelectedTool('eraser'))}
                >
                    <i className='fa-solid fa-eraser'></i>
                    <span className='nav-tool-span'>11</span>
                </Button>
            </div>
        </div>
    );
};

export default BoardToolbar;
