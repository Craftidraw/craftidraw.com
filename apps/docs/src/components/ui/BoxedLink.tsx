import { Col } from 'react-bootstrap';

interface BoxedLinkProps {
    title: string;
    description: React.ReactNode;
    link: string;
    icon?: string;
}

const BoxedLink = ({ title, description, link, icon }: BoxedLinkProps) => {
    return (
        <Col className='boxed-link-container p-3' md={6} lg={4} onClick={() => window.open(link, '_blank')}>
            <div className='boxed-link-content'>
                <div className='boxed-link-header my-2 px-3'>
                    {icon && <i className={icon + ' me-2'} aria-hidden='true' />}
                    <h5 className='m-0'>{title}</h5>
                </div>
                <div className='boxed-link-description px-3'>
                    <p>{description}</p>
                </div>
            </div>
        </Col>
    );
};

export default BoxedLink;
