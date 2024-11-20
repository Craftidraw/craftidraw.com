import { useOptions } from '~/hooks/useOptions';
import type { Item } from '~/types/item';
import { Button, Form } from 'react-bootstrap';
import React from 'react';

interface StrokeWidthOptionProps {
    item: Item;
}

const StrokeWidthOption: React.FC<StrokeWidthOptionProps> = ({ item }) => {
    const { setStrokeWidth } = useOptions();

    return (
        <>
            {item.isStrokeable && (
                <div className='d-flex flex-column'>
                    <Form.Label>Stroke Width</Form.Label>
                    <div>
                        <Button
                            variant='options'
                            active={item.strokeWidth === 1}
                            onClick={(e) => setStrokeWidth(item, 1)}
                        >
                            S
                        </Button>
                        <Button
                            variant='options'
                            active={item.strokeWidth === 2}
                            onClick={(e) => setStrokeWidth(item, 2)}
                        >
                            M
                        </Button>
                        <Button
                            variant='options'
                            active={item.strokeWidth === 3}
                            onClick={(e) => setStrokeWidth(item, 3)}
                        >
                            L
                        </Button>
                        <Button
                            variant='options'
                            active={item.strokeWidth === 4}
                            onClick={(e) => setStrokeWidth(item, 4)}
                        >
                            XL
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default StrokeWidthOption;
