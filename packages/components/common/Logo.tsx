import React from 'react';
import Image from 'next/image';

interface LogoProps {
    size?: number;
    center?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size, center }) => {
    return (
        <a className={'d-flex ' + (center ? 'align-self-center' : '')} href='/'>
            <Image
                src='/craftidraw-logo.png'
                alt='Logo'
                width={size}
                height={size}
                style={{
                    alignSelf: center ? 'center' : 'normal',
                    cursor: 'pointer',
                }}
            />
        </a>
    );
};

export default Logo;
