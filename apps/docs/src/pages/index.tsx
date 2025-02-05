import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepageLinks from '@site/src/components/HomepageLinks';
import { Container } from 'react-bootstrap';

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <div id='hero-wrapper'>
            <Container className='hero-container'>
                <h1 className='hero-title'>Plan with Craftidraw</h1>
                <p>Here you can find all the information you need to get started with Craftidraw.</p>
                <HomepageLinks />
            </Container>
        </div>
    );
}

export default function Home(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout title={`${siteConfig.title}`} description='Craftidraw Documentation'>
            <HomepageHeader />
            <main>
                <HomepageFeatures />
            </main>
        </Layout>
    );
}
