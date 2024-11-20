import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
    title: string;
    icon: string;
    description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
    {
        title: 'Free Board Forever.',
        icon: 'fa-solid fa-star',
        description: (
            <>
                Craftidraw is free to use forever. Visit <a href='https://craftidraw.com'>craftidraw.com</a> to get
                started.
            </>
        ),
    },
    {
        title: 'Need Cloud? We Got You.',
        icon: 'fas fa-cloud',
        description: (
            <>
                Craftidraw offers a cloud service for your boards. Visit{' '}
                <a href='https://app.craftidraw.com'>app.craftidraw.com</a> to setup collaborative workspaces and more.
            </>
        ),
    },
    {
        title: 'Open Source.',
        icon: 'fas fa-code',
        description: (
            <>
                Craftidraw is completely open source, even the cloud service. Visit the{' '}
                <a href='https://github.com/Craftidraw/craftidraw.com'>GitHub</a> to see the code.
            </>
        ),
    },
];

function Feature({ title, icon, description }: FeatureItem) {
    return (
        <div className={clsx('col col--4')}>
            <div className='text--center'>
                <i className={icon} aria-hidden='true' style={{ fontSize: '1.5rem', marginBottom: '1rem' }} />
            </div>
            <div className='text--center padding-horiz--md'>
                <Heading as='h4'>{title}</Heading>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures(): JSX.Element {
    return (
        <section className={styles.features}>
            <div className='container'>
                <div className='row'>
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
