import { Dropdown, DropdownButton } from 'react-bootstrap';
import React from 'react';
import { useItemOperations } from '~/hooks/useItemOperations';

const NavbarEditDropdown: React.FC = () => {
    const { undo, redo, cut, copy, paste } = useItemOperations();

    return (
        <DropdownButton variant='empty' title='Edit'>
            <Dropdown.Item
                onClick={(e) => {
                    e.preventDefault();
                    void undo();
                }}
            >
                <i className='fa-solid fa-rotate-left'></i>
                Undo
                <div className='keybind ms-auto'>Ctrl + Z</div>
            </Dropdown.Item>
            <Dropdown.Item
                onClick={(e) => {
                    e.preventDefault();
                    void redo();
                }}
            >
                <i className='fa-solid fa-rotate-right'></i>
                Redo
                <div className='keybind ms-auto'>Ctrl + Y</div>
            </Dropdown.Item>
            <Dropdown.Item
                onClick={(e) => {
                    e.preventDefault();
                    void copy();
                }}
            >
                <i className='fa-solid fa-copy'></i>
                Copy
                <div className='keybind ms-auto'>Ctrl + C</div>
            </Dropdown.Item>
            <Dropdown.Item
                onClick={(e) => {
                    e.preventDefault();
                    void cut();
                }}
            >
                <i className='fa-solid fa-scissors'></i>
                Cut
                <div className='keybind ms-auto'>Ctrl + X</div>
            </Dropdown.Item>
            <Dropdown.Item
                onClick={(e) => {
                    e.preventDefault();
                    void paste();
                }}
            >
                <i className='fa-solid fa-paste'></i>
                Paste
                <div className='keybind ms-auto'>Ctrl + V</div>
            </Dropdown.Item>
        </DropdownButton>
    );
};

export default NavbarEditDropdown;
