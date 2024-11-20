import React, { type ReactElement } from 'react';
import { Button } from 'react-bootstrap';

interface ModalNavbarProps {
    children: React.ReactNode;
    options: string[];
    state: string;
    setState: React.Dispatch<React.SetStateAction<string>>;
}

interface ModalNavbarItemProps {
    children: React.ReactNode;
    option: string;
    state?: string;
    setState?: React.Dispatch<React.SetStateAction<string>>;
    disabled?: boolean;
}

const ModalNavbar: React.FC<ModalNavbarProps> & { Item: React.FC<ModalNavbarItemProps> } = ({
    options,
    state,
    setState,
    children,
}) => {
    // Ensure all options have a corresponding ModalNavbarItem
    const items = React.Children.toArray(children) as ReactElement<ModalNavbarItemProps>[];
    const matchedItems = items.filter((item) => options.includes(item.props.option));

    if (matchedItems.length !== options.length) {
        console.warn('Some options do not have corresponding ModalNavbar.Item components or vice versa.');
    }

    return (
        <div className='modal-navbar'>
            {matchedItems.map((item, index) =>
                React.cloneElement(item, {
                    key: index,
                    state: state,
                    setState: setState,
                }),
            )}
        </div>
    );
};

const ModalNavbarItem: React.FC<ModalNavbarItemProps> = ({ option, state, setState, children, disabled }) => {
    return (
        <Button
            variant={state === option ? 'modal active' : 'modal'}
            onClick={() => setState && setState(option)}
            className='modal-navbar-item'
            disabled={disabled}
        >
            {children}
        </Button>
    );
};

ModalNavbar.Item = ModalNavbarItem;

export default ModalNavbar;
