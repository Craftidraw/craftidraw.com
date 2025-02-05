import { Container, Row } from 'react-bootstrap';
import BoxedLink from './ui/BoxedLink';

const DocLinkList: { title: string; icon: string; description: React.ReactNode; link: string }[] = [
    {
        title: 'Guides',
        icon: 'fas fa-book',
        description: (
            <>
                Explore our guides to master Craftidraw. Learn best practices and maximize your experience with
                step-by-step instructions.
            </>
        ),
        link: '/guides',
    },
    {
        title: 'Terms & Policies',
        icon: 'fas fa-file-contract',
        description: <>Review our terms and policies to understand how we handle privacy, data security, and more.</>,
        link: '/articles',
    },
    {
        title: 'Discounts',
        icon: 'fas fa-percent',
        description: (
            <>
                Learn about our available discounts. Students, educators, and open-source projects may qualify for
                special pricing or even free access to Craftium.
            </>
        ),

        link: '/discounts',
    },
];

export default function HomepageFeatures(): JSX.Element {
    return (
        <Container>
            <section>
                <h3
                    className='pb-2 px-4'
                    style={{
                        borderBottom: '1px solid var(--secondary-dark)',
                        textAlign: 'left',
                        color: 'var(--ifm-color-primary)',
                    }}
                >
                    Documentation
                </h3>

                <Container>
                    <Row>
                        {DocLinkList.map((props, idx) => (
                            <BoxedLink key={idx} {...props} />
                        ))}
                    </Row>
                </Container>
            </section>
        </Container>
    );
}
