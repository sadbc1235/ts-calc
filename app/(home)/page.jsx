'use client'

import { useEffect, useState } from "react";
import styles from "../../styles/calendar.module.css"
import { callPostApi, fnGetCurrencyCodeView, fnGetDateNow, fnGetDayfirstDate, fnGetLastDate } from "../constants";
import Loading from "../../components/loading";

export default function HomePage() {
    const [isLoading, setIsLoading] = useState(true);
    const dateNow = fnGetDateNow('-').substring(0, 7);
    const [date, setDate] = useState(dateNow)
    const [dateMap, setDateMap] = useState([]);
    const [totalAmt, setTotalAmt] = useState(0);

    const handleChange = (e) => {
        setDate(e.target.value);
    }

    const getDateMap = (dateMonth) => {
        const prevDateMonth = dateMonth.split('-')[0] +'-'+ ((+dateMonth.split('-')[1]) - 1 == 0 ? '12' : (+dateMonth.split('-')[1]) - 1 < 10 ? '0'+((+dateMonth.split('-')[1]) - 1) : (+dateMonth.split('-')[1]) - 1);
        const prevLastDate = fnGetLastDate(prevDateMonth);
        const currLastDate = fnGetLastDate(dateMonth);
        const dayIdx = fnGetDayfirstDate(dateMonth);

        const url = window.location.origin+'/api/getCalendarAmtList';
        callPostApi(
            url
            , {
                prevDate: prevDateMonth.replaceAll('-', '')
                , curDate: dateMonth.replaceAll('-', '')
            }
            , (data) => {
                console.log(data);
                const prevMonthAmtList = data.filter(item => item.spendDate.includes(prevDateMonth));
                const curMonthAmtList = data.filter(item => item.spendDate.includes(dateMonth));
                let totalAmt = 0;

                let dateMap = [];
                let idx = 0;
                for(let i=(prevLastDate - dayIdx+1); i<=prevLastDate; i++) {
                    const amt = prevMonthAmtList.filter(item => (+item.spendDate.split('-')[2]) == i)[0]?.amt || 0;
                    dateMap.push({date: i, shadow: true, key: idx++, amt, today: false, red: false});
                }
                for(let i=1; i<=currLastDate; i++) {
                    const amt = curMonthAmtList.filter(item => (+item.spendDate.split('-')[2]) == i)[0]?.amt || 0;
                    totalAmt += amt
                    dateMap.push({date: i, shadow: false, key: idx++, amt, today: (fnGetDateNow('-') == ( dateMonth+'-'+(i < 10 ? '0'+i : i))), red: (totalAmt > 3000000)});
                }
                const dateMapLength = 42-dateMap.length;
                for(let i=1; i<=dateMapLength; i++) {
                    dateMap.push({date: i, shadow: true, key: idx++, today: false, red: false});
                }
                setDateMap(dateMap);
                setTotalAmt(totalAmt);
                setIsLoading(false);
            }
        );   
    }

    useEffect(() => {
        getDateMap(date);
    }, [date])

    return (
        <>
            {isLoading && <Loading/>}
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
                    <article 
                        className={item.shadow ? `${styles.dateBox} ${styles.shadow}` : item.today ? `${styles.dateBox} ${styles.today}` : item.red ? `${styles.dateBox} ${styles.red}` : styles.dateBox} 
                        key={item.key}
                        onClick={() => {}}
                    >
                        <div>{item.date}</div>
                        <div>{fnGetCurrencyCodeView(item.amt)}</div>
                    </article>
                ))}
            </section>
            <section className={styles.totalWrap}>
                <article>
                    <div>총 지출</div>
                    <div>{fnGetCurrencyCodeView(totalAmt)} &#8361;</div>
                </article>
                <article>
                    <div>월 한도</div>
                    <div>3,000,000 &#8361;</div>
                </article>
            </section>
        </>
    );
}