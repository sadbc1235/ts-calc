'use client'

import styles from '../styles/notice.module.css';

export default function Notice({isActvie, type, msg}) {
    return (
        <div className={isActvie && type == 'warning' ? `${styles.container} ${styles.warning} ${styles.active}` : isActvie && type == 'success' ? `${styles.container} ${styles.success} ${styles.active}` : styles.container}>
            {msg}
        </div>
    );
}