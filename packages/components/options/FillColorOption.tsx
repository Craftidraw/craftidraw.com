import { type Item } from '~/types/item';
import React from 'react';
import ColorOption from './ColorOption';

interface FillColorOptionProps {
    item: Item;
}

const FillColorOption: React.FC<FillColorOptionProps> = ({ item }) => {
    return <ColorOption item={item} type='fill' />;
};

export default FillColorOption;
