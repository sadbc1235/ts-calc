'use client'

import { useEffect, useState } from "react";
import styles from "../../styles/calendar.module.css"
import { fnGetDateNow, fnGetDayfirstDate, fnGetLastDate } from "../constants";

export default function HomePage() {
    const dateNow = fnGetDateNow('-').substring(0, 7);
    const [date, setDate] = useState(dateNow)
    const [dateMap, setDateMap] = useState([]);

    const handleChange = (e) => {
        setDate(e.target.value);
    }

    const getDateMap = (dateMonth) => {
        const prevDateMonth = dateMonth.split('-')[0] +'-'+ ((+dateMonth.split('-')[1]) - 1 == 0 ? '12' : (+dateMonth.split('-')[1]) - 1)
        const prevLastDate = fnGetLastDate(prevDateMonth);
        const currLastDate = fnGetLastDate(dateMonth);
        const dayIdx = fnGetDayfirstDate(dateMonth);
        let dateMap = [];
        let idx = 0;
        for(let i=(prevLastDate - dayIdx+1); i<=prevLastDate; i++) {
            dateMap.push({date: i, shadow: true, key: idx++});
        }
        for(let i=1; i<=currLastDate; i++) {
            dateMap.push({date: i, shadow: false, key: idx++});
        }
        const dateMapLength = 42-dateMap.length;
        for(let i=1; i<=dateMapLength; i++) {
            dateMap.push({date: i, shadow: true, key: idx++});
        }

        setDateMap(dateMap);
    }

    useEffect(() => {
        getDateMap(date);
    }, [date])

    return (
        <>
            <section className={styles.search}>
                <input type="month" defaultValue={date} onChange={handleChange} />
            </section>
            <section className={styles.container}>
                <article>
                    일
                </article>
                <article>
                    월
                </article>
                <article>
                    화
                </article>
                <article>
                    수
                </article>
                <article>
                    목
                </article>
                <article>
                    금
                </article>
                <article>
                    토
                </article>
                {dateMap.map((item) => (
                    <article className={item.shadow ? `${styles.dateBox} ${styles.shadow}` : styles.dateBox} key={item.key}>
                        <div>{item.date}</div>
                    </article>
                ))}
            </section>
        </>
    );
}