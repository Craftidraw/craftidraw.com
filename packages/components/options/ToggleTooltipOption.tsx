import { type CustomItem, type Item } from '~/types/item';
import React from 'react';
import { useOptions } from '~/hooks/useOptions';
import { Form } from 'react-bootstrap';

interface ToggleTooltipOptionProps {
    item: Item;
}

const ToggleTooltipOption: React.FC<ToggleTooltipOptionProps> = ({ item }) => {
    const { toggleTooltip } = useOptions();

    return (
        <>
            {item.type === 'custom' && (
                <div className='d-flex flex-row align-items-center'>
                    <Form.Label>Always Show Tooltip</Form.Label>
                    <Form.Check
                        className='ms-auto'
                        type='switch'
                        checked={(item as CustomItem).showTooltip}
                        onChange={() => toggleTooltip(item)}
                    />
                </div>
            )}
        </>
    );
};

export default ToggleTooltipOption;
