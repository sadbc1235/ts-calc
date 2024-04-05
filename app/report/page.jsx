'use client'

import MainUserBox from "../../components/main-user-box";
import { callPostApi, fnGetDateNow } from "../constants";
import { useEffect, useState } from "react";
import styles from "../../styles/report.module.css"

export default function reportPage({searchParams}) {
    const dateNow = !!searchParams?.date ? searchParams.date : fnGetDateNow('-').substring(0, 7);
    const [date, setDate] = useState(dateNow);
    const [userList, setUserList] = useState([]);

    const getTotalAmtList = () => {
        const url = window.location.origin+'/api/getTotalAmtList';
        callPostApi(
            url
            , {date: (date.replaceAll('-', ''))}
            , setUserList
        );
    }

    useEffect(() => {
        getTotalAmtList();
    }, [date])

    const handleChange = (e) => {
        setDate(e.target.value);
    }

    return (
        <div>
            <section className={styles.search}>
                <input type="month" defaultValue={date} onChange={handleChange} />
            </section>
            <section className={styles.container}>
                {userList.map(item => (
                    <MainUserBox key={item.empSeq} empSeq={item.empSeq} empName={item.empName} totalAmt={item.totalAmt} date={date} />
                ))}
            </section>
        </div>
    );
}