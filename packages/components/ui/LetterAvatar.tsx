import React from 'react';

const LetterAvatar = ({ letter = 'A', size = 40 }) => {
    const style = {
        width: size,
        height: size,
        backgroundColor: 'var(--primary)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size / 3,
        fontWeight: '600',
        textTransform: 'uppercase',
    };

    return <div style={style}>{letter.charAt(0)}</div>;
};

export default LetterAvatar;
