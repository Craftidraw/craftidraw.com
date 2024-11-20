import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Image from 'next/image';

const BlockBottom: React.FC = () => {
    return (
        <div className='mt-5'>
            <hr style={{ opacity: 0.1, borderStyle: 'dashed' }} />
            <div
                className='d-flex flex-column justify-content-center align-items-center'
                style={{ minHeight: '10vh', opacity: 0.5 }}
            >
                <Image src='/craftidraw-logo.png' alt='' width={40} height={40} />
                <Row className='mt-3'>
                    <Col>Home</Col>
                    <Col>About</Col>
                    <Col>Contact</Col>
                    <Col>FAQ</Col>
                    <Col>Legal</Col>
                    <Col>Privacy</Col>
                </Row>
            </div>
        </div>
    );
};

export default BlockBottom;
