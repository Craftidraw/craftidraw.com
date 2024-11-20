import { useOptions } from '~/hooks/useOptions';
import type { Item, LineItem } from '~/types/item';
import { Button, Form } from 'react-bootstrap';
import React from 'react';

interface ArrowHeadOptionProps {
    item: Item;
}

const ArrowHeadOption: React.FC<ArrowHeadOptionProps> = ({ item }) => {
    const { toggleArrowHead } = useOptions();
    return (
        <>
            {item.type === 'line' && (
                <div className='d-flex flex-column'>
                    <Form.Label style={{ width: '100%' }}>Arrow Head</Form.Label>
                    <div>
                        <Button
                            variant='options'
                            active={!(item as LineItem).hasArrowHead && !(item as LineItem).hasArrowTail}
                            onClick={() => toggleArrowHead(item, 'none')}
                        >
                            None
                        </Button>
                        <Button
                            variant='options'
                            active={(item as LineItem).hasArrowHead}
                            onClick={() => toggleArrowHead(item, 'head')}
                        >
                            Head
                        </Button>
                        <Button
                            variant='options'
                            active={(item as LineItem).hasArrowTail}
                            onClick={() => toggleArrowHead(item, 'tail')}
                        >
                            Tail
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ArrowHeadOption;
