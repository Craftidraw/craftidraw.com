import React from 'react';

interface InputGroupWrapperProps {
    children: React.ReactNode;
}

const InputGroupWrapper = ({ children }: InputGroupWrapperProps) => {
    return <div className='input-group-wrapper'>{children}</div>;
};

export default InputGroupWrapper;
