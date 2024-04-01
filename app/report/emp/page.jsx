'use client'

import MainUserBox from "../../../components/main-user-box";
import { callPostApi, fnGetDateNow } from "../../constants";
import { useEffect, useState } from "react";
import styles from "../../../styles/home.module.css"

export default function reportEmpPage() {
    const dateNow = fnGetDateNow('-').substring(0, 7);
    const [date, setDate] = useState(dateNow);
    const [userList, setUserList] = useState([]);

    const getUserList = () => {
        const url = window.location.origin+'/api/getTotalAmtList';
        callPostApi(
            url
            , {date: (date.replaceAll('-', ''))}
            , setUserList
        );
    }
    

    useEffect(() => {
        getUserList();
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
                    <MainUserBox key={item.empSeq} empName={item.empName} totalAmt={item.totalAmt} />
                ))}
            </section>
        </div>
    );
}