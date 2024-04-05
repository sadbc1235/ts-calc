'use client'

import styles from '../styles/loading.module.css';

export default function Loading() {
    return (
        <div className={styles.loadingWrap}>
            <div>
                <img src="/loading.gif" />
            </div>
        </div>
    );
}