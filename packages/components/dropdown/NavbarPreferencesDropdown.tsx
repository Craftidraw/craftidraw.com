import { Dropdown, DropdownButton, Form } from 'react-bootstrap';
import type { RootState } from '~/lib/store/store';
import React from 'react';
import { updateBoard } from '~/lib/store/features/appSlice';
import { useAppDispatch, useAppSelector } from '~/lib/store/hooks';

const NavbarPreferencesDropdown = () => {
    const dispatch = useAppDispatch();

    const board = useAppSelector((state: RootState) => state.app.board);

    return (
        <DropdownButton variant='empty' title='Preferences'>
            <Dropdown.Item disabled={true}>
                <small>These options only apply to this board.</small>
            </Dropdown.Item>
            <Dropdown.Item
                onClick={(e) => {
                    e.stopPropagation();
                    dispatch(updateBoard({ ...board, enableGrid: !board.enableGrid }));
                }}
            >
                Enable Grid
                <Form.Check className='ms-auto' type='switch' id='grid' checked={board.enableGrid} />
            </Dropdown.Item>
            <Dropdown.Item onClick={(e) => e.stopPropagation()}>
                Grid Spacing
                <Form.Control
                    className='ms-auto'
                    type='number'
                    size='sm'
                    value={board.gridSpacing}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) {
                            dispatch(updateBoard({ ...board, gridSpacing: val }));
                        }
                    }}
                    style={{
                        maxWidth: '4rem',
                        fontSize: '12px',
                        padding: '0.25rem',
                    }}
                />
            </Dropdown.Item>
            <Dropdown.Item
                onClick={(e) => {
                    e.stopPropagation();
                    dispatch(updateBoard({ ...board, snapToGrid: !board?.snapToGrid }));
                }}
            >
                Snap to Grid
                <Form.Check className='ms-auto' type='switch' id='snapGrid' checked={board.snapToGrid} />
            </Dropdown.Item>
            <Dropdown.Item onClick={(e) => e.stopPropagation()}>
                Snap Increment
                <Form.Control
                    className='ms-auto'
                    size='sm'
                    type='number'
                    value={board.snapIncrement}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) {
                            dispatch(updateBoard({ ...board, snapIncrement: val }));
                        }
                    }}
                    style={{
                        maxWidth: '4rem',
                        fontSize: '12px',
                        padding: '0.25rem',
                    }}
                />
            </Dropdown.Item>
            <Dropdown.Item onClick={(e) => e.stopPropagation()}>
                Grid Line Color
                <Form.Control
                    className='ms-auto form-control-color'
                    type='color'
                    size='sm'
                    value={board.gridLineColor}
                    onChange={(e) => {
                        // dispatch(setBoard({...board, : e.target.value}));
                    }}
                    style={{
                        maxWidth: '4rem',
                        fontSize: '12px',
                        padding: '0.25rem',
                    }}
                />
            </Dropdown.Item>
            <Dropdown.Item onClick={(e) => e.stopPropagation()}>
                Grid Sub Line Color
                <Form.Control
                    className='ms-auto'
                    type='color'
                    size='sm'
                    value={board.gridSubLineColor}
                    onChange={(e) => {
                        // dispatch(setBoard({...board, : e.target.value}));
                    }}
                    style={{
                        maxWidth: '4rem',
                        fontSize: '12px',
                        padding: '0.25rem',
                    }}
                />
            </Dropdown.Item>
            <hr />
            <Dropdown.Item
                onClick={(e) => {
                    e.stopPropagation();
                    dispatch(updateBoard({ ...board, showItems: !board?.showItems }));
                }}
            >
                Show All Items
                <Form.Check className='ms-auto' type='switch' id='showItems' checked={board.showItems} />
            </Dropdown.Item>
            <hr />
            <Dropdown.Item>
                Theme
                <DropdownButton
                    className='ms-auto'
                    size='sm'
                    variant='secondary'
                    title={board.theme}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Dropdown.Item href='#'>System</Dropdown.Item>
                    <Dropdown.Item href='#'>Light</Dropdown.Item>
                    <Dropdown.Item href='#'>Dark</Dropdown.Item>
                </DropdownButton>
            </Dropdown.Item>
            <Dropdown.Item onClick={(e) => e.stopPropagation()}>
                Background Color
                <Form.Control
                    className='ms-auto'
                    type='color'
                    size='sm'
                    value={board.snapIncrement}
                    onChange={(e) => {
                        // dispatch(setBoard({...board, : e.target.value}));
                    }}
                    style={{
                        maxWidth: '4rem',
                        fontSize: '12px',
                        padding: '0.25rem',
                    }}
                />
            </Dropdown.Item>
        </DropdownButton>
    );
};

export default NavbarPreferencesDropdown;
