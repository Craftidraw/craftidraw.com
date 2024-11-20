import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header className={clsx('hero', styles.heroBanner)}>
            <div className='container'>
                <Heading as='h1' className='hero__title' style={{ color: 'var(--ifm-font-color-base)' }}>
                    Documentation
                </Heading>
                <p>Here you can find all the information you need to get started with Craftidraw.</p>
                <div className={styles.buttons}>
                    <Link className='button button--secondary button--md' to='/guides/getting-started'>
                        Getting Started
                    </Link>
                </div>
            </div>
        </header>
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
