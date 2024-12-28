import { Dropdown, DropdownButton } from 'react-bootstrap';
import React from 'react';
import { useRouter } from 'next/navigation';

const NavbarGeneralDropdown: React.FC = () => {
    const navigate = useRouter();
    // const { data: session } = useSession();

    return (
        <DropdownButton variant='empty' title='General'>
            <Dropdown.Item
                onClick={(e) => {
                    e.preventDefault();
                    navigate.push('/');
                }}
            >
                <i className='fa-solid fa-house'></i>
                Home
            </Dropdown.Item>
            <Dropdown.Item
                // disabled={!session?.user || !workspace}
                onClick={(e) => {
                    e.preventDefault();
                    navigate.push('/workspace');
                }}
            >
                <i className='fa-solid fa-bars'></i>
                Workspace
            </Dropdown.Item>
            <Dropdown.Item
                // disabled={!user || !workspace}
                onClick={(e) => {
                    e.preventDefault();
                    navigate.push('/boards');
                }}
            >
                <i className='fa-solid fa-bars'></i>
                Boards
            </Dropdown.Item>
        </DropdownButton>
    );
};

export default NavbarGeneralDropdown;
