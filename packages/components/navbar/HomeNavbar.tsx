'use client';

import React, { useEffect, useState } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import Image from 'next/image';

const HomeNavbar: React.FC = () => {
    const [isTop, setIsTop] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const shouldBeTop = scrollPosition < 86;
            if (shouldBeTop !== isTop) {
                setIsTop(shouldBeTop);
            }
        };
        document.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('scroll', handleScroll);
        };
    }, [isTop]);

    return (
        <Navbar
            id='home-navbar-container'
            style={{
                backgroundColor: isTop ? 'transparent' : 'rgb(255, 255, 255, 0.9)',
                transition: 'background-color 0.2s ease',
            }}
        >
            <div id='home-navbar-links' className='d-flex flex-row align-content-center'>
                <div className='d-flex align-self-center'>
                    <Nav.Link
                        href='/docs'
                        style={{ fontFamily: 'Darumadrop One', marginRight: '1rem', fontSize: '1rem' }}
                    >
                        Documentation
                    </Nav.Link>
                    <Nav.Link
                        href='/github'
                        style={{ fontFamily: 'Darumadrop One', marginRight: '1rem', fontSize: '1rem' }}
                    >
                        GitHub
                    </Nav.Link>
                    <Nav.Link
                        href='#faq'
                        style={{ fontFamily: 'Darumadrop One', marginRight: '1rem', fontSize: '1rem' }}
                    >
                        FAQ
                    </Nav.Link>
                </div>
                <div className='d-flex align-self-center'>
                    <Image
                        src={isTop ? '/craftidraw-logo-green.png' : '/craftidraw-logo.png'}
                        alt='logo'
                        width={60}
                        height={60}
                        className={`logo ${isTop ? 'logo-green' : 'logo-default'}`}
                    />
                </div>
                <div className='d-flex align-self-center'>
                    <Nav.Link
                        href='#pricing'
                        style={{
                            fontFamily: 'Darumadrop One',
                            marginLeft: '1rem',
                            fontSize: '1rem',
                        }}
                    >
                        Pricing
                    </Nav.Link>
                    <Nav.Link
                        href='/community'
                        style={{ fontFamily: 'Darumadrop One', marginLeft: '1rem', fontSize: '1rem' }}
                    >
                        Community
                    </Nav.Link>
                    <Nav.Link
                        href='/contact'
                        style={{ fontFamily: 'Darumadrop One', marginLeft: '1rem', fontSize: '1rem' }}
                    >
                        Contact
                    </Nav.Link>
                </div>
            </div>
        </Navbar>
    );
};

export default HomeNavbar;
