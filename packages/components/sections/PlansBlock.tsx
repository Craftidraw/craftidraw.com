'use client';

import { Button, Form, OverlayTrigger, Popover } from 'react-bootstrap';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const PlansBlock: React.FC = () => {
    const router = useRouter();
    const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly');

    return (
        <table style={{ width: '100%' }}>
            <tbody>
                <tr>
                    <td style={{ border: 'none' }}>
                        <h3>Features</h3>
                    </td>
                    <td style={{ border: 'none' }}>
                        <h3>Free</h3>
                    </td>
                    <td style={{ border: 'none' }}>
                        <h3>Craftium Solo</h3>
                    </td>
                    <td style={{ border: 'none' }}>
                        <h3>Craftium Team</h3>
                    </td>
                </tr>
                <tr>
                    <td style={{ border: 'none' }}></td>
                    <td style={{ border: 'none' }}></td>
                    <td style={{ border: 'none' }}>
                        <div className='d-flex flex-row'>
                            <small>Monthly</small>
                            <Form.Check
                                className='mx-2'
                                type='switch'
                                checked={plan !== 'monthly'}
                                onChange={() => {
                                    setPlan(plan === 'monthly' ? 'yearly' : 'monthly');
                                }}
                            />
                            <small>Annually</small>
                        </div>
                    </td>
                    <td style={{ border: 'none' }}>
                        <div className='d-flex flex-row'>
                            <small>Monthly</small>
                            <Form.Check
                                className='mx-2'
                                type='switch'
                                checked={plan !== 'monthly'}
                                onChange={() => {
                                    setPlan(plan === 'monthly' ? 'yearly' : 'monthly');
                                }}
                            />
                            <small>Annually</small>
                        </div>
                    </td>
                </tr>
                <tr id='pricing'>
                    <td style={{ border: 'none' }}></td>
                    <td style={{ border: 'none' }}>Free forever</td>
                    <td style={{ border: 'none' }}>
                        {plan === 'monthly' ? (
                            <>
                                <p>$5.00/mo</p>
                            </>
                        ) : (
                            <>
                                <p
                                    style={{
                                        textDecoration: 'line-through',
                                        fontSize: '0.8rem',
                                        color: '#6a6a6a',
                                        margin: '0',
                                    }}
                                >
                                    $60.00/yr
                                </p>
                                <p style={{ fontSize: '1rem', margin: '0' }}>$50.00/yr</p>
                                <h6 style={{ color: 'var(--primary-darker)' }}>2 months off!</h6>
                            </>
                        )}
                    </td>
                    <td style={{ border: 'none' }}>
                        {plan === 'monthly' ? (
                            <>
                                <p>$7.00/mo per user</p>
                            </>
                        ) : (
                            <>
                                <p
                                    style={{
                                        textDecoration: 'line-through',
                                        fontSize: '0.8rem',
                                        color: '#6a6a6a',
                                        margin: '0',
                                    }}
                                >
                                    $84.00/yr
                                </p>
                                <p style={{ fontSize: '1rem', margin: '0' }}>$70.00/yr per user</p>
                                <h6 style={{ color: 'var(--primary-darker)' }}>2 months off!</h6>
                            </>
                        )}
                    </td>
                </tr>
                <tr>
                    <td style={{ border: 'none' }}></td>
                    <td style={{ border: 'none' }}>
                        <Button variant='primary' onClick={() => router.push('/')}>
                            Get Started
                        </Button>
                    </td>
                    <td style={{ border: 'none' }}>
                        <Button
                            variant='primary'
                            onClick={() => {
                                const path =
                                    '/purchase?product=solo&plan=' + (plan === 'monthly' ? 'monthly' : 'yearly');
                                router.push(path);
                            }}
                        >
                            Upgrade to Solo
                        </Button>
                    </td>
                    <td style={{ border: 'none' }}>
                        <Button
                            variant='primary'
                            disabled={true}
                            onClick={() => {
                                const path =
                                    '/purchase?product=team&plan=' + (plan === 'monthly' ? 'monthly' : 'yearly');
                                router.push(path);
                            }}
                        >
                            Coming Soon
                        </Button>
                    </td>
                </tr>
                <tr>
                    <td style={{ border: 'none' }}></td>
                    <td style={{ border: 'none' }}></td>
                    <td style={{ border: 'none' }}>
                        <small>Try 7 days free</small>
                    </td>
                    <td style={{ border: 'none' }}>
                        <small>Try 7 days free</small>
                    </td>
                </tr>
                <tr>
                    <td style={{ border: 'none' }}>
                        <h4>Create</h4>
                    </td>
                </tr>
                <tr>
                    <td>Infinite Board</td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                </tr>
                <tr>
                    <td>Unlimited Boards</td>
                    <td>
                        <i className='fa-solid fa-xmark'></i>
                    </td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                </tr>
                <tr>
                    <td>Unlimited Elements</td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                </tr>
                <tr>
                    <td>Board Collections</td>
                    <td>
                        <i className='fa-solid fa-xmark'></i>
                    </td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                </tr>
                <tr>
                    <td>Element Tooltips</td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                </tr>
                <tr>
                    <td>Cloud Storage</td>
                    <td>
                        <i className='fa-solid fa-xmark'></i>
                    </td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                </tr>
                <tr>
                    <td style={{ border: 'none' }}>
                        <h4>Collaboration</h4>
                    </td>
                </tr>
                <tr>
                    <td>Personal Workspace</td>
                    <td>
                        <i className='fa-solid fa-xmark'></i>
                    </td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                    <td>
                        <OverlayTrigger
                            placement='right'
                            overlay={
                                <Popover>
                                    <Popover.Body>
                                        <p>Each user with a Craftium seat will have their own personal workspace.</p>
                                    </Popover.Body>
                                </Popover>
                            }
                        >
                            <i className='fa-regular fa-circle-question'></i>
                        </OverlayTrigger>
                    </td>
                </tr>
                <tr>
                    <td>Team Workspace</td>
                    <td>
                        <i className='fa-solid fa-xmark'></i>
                    </td>
                    <td>
                        <i className='fa-solid fa-xmark'></i>
                    </td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                </tr>
                <tr>
                    <td>Sharing With Link</td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                </tr>
                <tr>
                    <td>Inviting With Link</td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                </tr>
                <tr>
                    <td>Permission Management</td>
                    <td>
                        <i className='fa-solid fa-xmark'></i>
                    </td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                </tr>
                <tr>
                    <td>Board Members</td>
                    <td>Up to 3</td>
                    <td>Unlimited</td>
                    <td>Unlimited</td>
                </tr>
                <tr>
                    <td>Teams & Roles</td>
                    <td>
                        <i className='fa-solid fa-xmark'></i>
                    </td>
                    <td>
                        <i className='fa-solid fa-xmark'></i>
                    </td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                </tr>
                <tr>
                    <td style={{ border: 'none' }}>
                        <h4>Library & Export</h4>
                    </td>
                </tr>
                <tr>
                    <td>Image Library</td>
                    <td>Local Storage</td>
                    <td>Cloud Storage</td>
                    <td>Cloud Storage</td>
                </tr>
                <tr>
                    <td>Item Library</td>
                    <td>Local Storage</td>
                    <td>Cloud Storage</td>
                    <td>Cloud Storage</td>
                </tr>
                <tr>
                    <td>Export Options</td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                </tr>
                <tr>
                    <td>Import Options</td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                    <td>
                        <i className='fa-regular fa-circle-check'></i>
                    </td>
                </tr>
                <tr>
                    <td>Item Export Formats</td>
                    <td>JSON, YAML</td>
                    <td>Create Custom Exports</td>
                    <td>Create Custom Exports</td>
                </tr>
            </tbody>
        </table>
    );
};

export default PlansBlock;
