import React from 'react';

const Loader: React.FC = () => {
    return (
        <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
            <div className='spinner-border' role='status'></div>
        </div>
    );
};

export default Loader;
