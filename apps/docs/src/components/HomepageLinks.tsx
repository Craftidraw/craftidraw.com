import { Container, Row } from 'react-bootstrap';
import BoxedLink from './ui/BoxedLink';

const LinkList: { title: string; icon: string; description: React.ReactNode; link: string }[] = [
    {
        title: 'Board',
        icon: 'fas fa-pencil-ruler',
        description: (
            <>
                Our free, forever-accessible board. Enjoy all features without limitations, create sessions, and
                seamlessly collaborate with others.
            </>
        ),
        link: 'https://craftidraw.com',
    },
    {
        title: 'Cloud Platform',
        icon: 'fas fa-cloud',
        description: (
            <>
                Our cloud-based board platform. Access your boards from anywhere, set up teams, manage permissions, and
                more—all at an affordable price.
            </>
        ),
        link: 'https://app.craftidraw.com',
    },
];

export default function HomepageLinks(): JSX.Element {
    return (
        <section>
            <h3
                className='pb-2 px-4'
                style={{
                    borderBottom: '1px solid var(--secondary-dark)',
                    textAlign: 'left',
                    color: 'var(--ifm-color-primary)',
                }}
            >
                Platforms
            </h3>
            <Container>
                <Row>
                    {LinkList.map((props, idx) => (
                        <BoxedLink key={idx} {...props} />
                    ))}
                </Row>
            </Container>
        </section>
    );
}
