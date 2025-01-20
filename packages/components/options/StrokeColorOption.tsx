import { type Item } from '~/types/item';
import React from 'react';
import ColorOption from './ColorOption';

interface StrokeColorOptionProps {
    item: Item;
}

const StrokeColorOption: React.FC<StrokeColorOptionProps> = ({ item }) => {
    return <ColorOption item={item} type='stroke' />;
};

export default StrokeColorOption;
