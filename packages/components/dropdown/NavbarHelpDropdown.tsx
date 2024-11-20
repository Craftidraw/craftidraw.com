import { Dropdown, DropdownButton } from 'react-bootstrap';
import React from 'react';

const NavbarHelpDropdown: React.FC = () => {
    return (
        <DropdownButton variant='empty' title='Help'>
            <Dropdown.Item href='https://discord.gg/kUwaKXkVCu' target='_blank'>
                <i className='fa-brands fa-discord'></i>
                Discord
            </Dropdown.Item>
            <hr />
            <Dropdown.Item href='https://github.com/Craftidraw/craftidraw.com' target='_blank'>
                <i className='fa-brands fa-github'></i>
                GitHub
            </Dropdown.Item>
            <Dropdown.Item href='https://github.com/Craftidraw/craftidraw.com/releases' target='_blank'>
                <i className='fa-solid fa-pen'></i>
                Patch Notes
            </Dropdown.Item>
            <Dropdown.Item href='https://github.com/Craftidraw/craftidraw.com/issues' target='_blank'>
                <i className='fa-solid fa-bug'></i>
                Report an Issue
            </Dropdown.Item>
            <hr />
            <Dropdown.Item href='https://docs.craftidraw.com/' target='_blank'>
                <i className='fa-solid fa-book'></i>
                Documentation
            </Dropdown.Item>
            <Dropdown.Item href='https://docs.craftidraw.com/articles/contact' target='_blank'>
                <i className='fa-solid fa-envelope'></i>
                Contact Us
            </Dropdown.Item>
            <Dropdown.Item href='https://docs.craftidraw.com/articles/terms-of-service' target='_blank'>
                <i className='fa-solid fa-circle-question'></i>
                Terms of Service
            </Dropdown.Item>
            <Dropdown.Item href='https://docs.craftidraw.com/articles/privacy-policy' target='_blank'>
                <i className='fa-solid fa-lock'></i>
                Privacy Policy
            </Dropdown.Item>
            <hr />
            <Dropdown.Item href='https://app.craftidraw.com/' target='_blank'>
                <i className='fa-solid fa-cloud'></i>
                Craftium
            </Dropdown.Item>
        </DropdownButton>
    );
};

export default NavbarHelpDropdown;
