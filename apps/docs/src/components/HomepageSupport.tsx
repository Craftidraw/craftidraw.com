import { Row } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import BoxedLink from './ui/BoxedLink';

const SupportLinkList = [
    {
        icon: 'fab fa-discord',
        title: 'Discord',
        description: 'Join our community on Discord to get help and support from the Craftidraw team and other users.',
        link: 'https://discord.gg/kUwaKXkVCu',
    },
    {
        icon: 'fas fa-bug',
        title: 'Issues',
        description: 'Want to contribute to the project? Report an issue or suggest a feature on GitHub.',
        link: 'https://github.com/Craftidraw/craftidraw.com/issues',
    },
    {
        icon: 'fas fa-code',
        title: 'Contribute',
        description:
            'Find something unclear or want to improve the documentation? Contribute to the project on GitHub.',
        link: 'https://github.com/Craftidraw/craftidraw.com/',
    },

    {
        icon: 'fas fa-envelope',
        title: 'Email',
        description: 'Have a question or need help? Send us an email.',
        link: 'mailto:contact@craftidraw.com',
    },
];

export default function HomepageSupport(): JSX.Element {
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
                    Support
                </h3>
                <Container>
                    <Row>
                        {SupportLinkList.map((props, idx) => (
                            <BoxedLink key={idx} {...props} />
                        ))}
                    </Row>
                </Container>
            </section>
        </Container>
    );
}
