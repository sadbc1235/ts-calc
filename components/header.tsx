'use client'

import styles from '../styles/header.module.css';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
    const path = usePathname();
    const [active, setActive] = useState(false);
    const router = useRouter();
    const [cnt, setCnt] = useState(0);

    const fnClick = () => {
        setCnt(cnt+1);
        if(cnt == 3) {
            router.push(`/name`);
            setCnt(0);
        }
    }
    return (
        <div className={styles.headerWrap}>
            <header className={styles.container}>
                <figure>
                    <img src="/TS_LOGO.png" onClick={fnClick} />
                </figure>
                {path == "/name" ? <div></div> :
                <div onClick={() => setActive(!active)}>
                    <svg height="1.2em" viewBox="0 0 448 512">
                        <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/>
                    </svg>
                </div>
                }
            </header>
            {path == "/name" ? <div></div> : 
            <nav className={active ? `${styles.nav} ${styles.active}` : styles.nav}>
                <ul>
                    <li className={active ? styles.active : ''}>
                        <Link href='/' className={path == "/" ? styles.in : ''}  onClick={() => setActive(false)}>Home</Link>
                    </li>
                    <li className={active ? styles.active : ''}>
                        <Link href='/report' className={path == "/report" ? styles.in : ''} onClick={() => setActive(false)}>Report</Link>
                    </li>
                    <li className={active ? styles.active : ''}>
                        <Link href='/add' className={path == "/add" ? styles.in : ''} onClick={() => setActive(false)}>Add</Link>
                    </li>
                </ul>
            </nav>
            }
        </div>
    );
}