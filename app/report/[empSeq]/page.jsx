import { fnGetCurrencyCodeView } from "../../constants";
import styles from "../../../styles/reportEmp.module.css"
import executeQuery from "../../_lib/db";
import Link from "next/link";

const getResList = async (empSeq, date) => {
    const sql = `
    SELECT
        res.res_seq	AS resSeq
        , res.emp_seq	AS empSeq
        , emp.name	AS empName
        , DATE_FORMAT(res.spend_date, '%Y-%m-%d')	AS spendDate
        , res.amt	AS amt
    FROM	res	res

    INNER JOIN ts_emp emp
    ON	res.emp_seq	= emp.emp_seq

    WHERE	res.emp_seq	= ?
    AND	res.spend_date    LIKE CONCAT(?, '%')
    
    ORDER BY res.spend_date`;

    const data = await executeQuery(sql, [empSeq, date]);
    const dataJson = await JSON.parse(JSON.stringify(data));
    return dataJson
}

export default async function reportEmpPage({params, searchParams}) {
    const resList = await getResList(params.empSeq, searchParams.date.replaceAll('-', ''));

    return (
        <div>
            <section className={styles.backWrap}>
                <Link href={`/report?date=${searchParams.date}`}>Back</Link>
            </section>
            <section className={styles.titleWrap}>
                <article>
                    <div>
                        {searchParams.date} 지출현황
                    </div>
                    <div>
                        {resList[0].empName} 
                    </div>
                </article>
            </section>
            <section className={styles.container}>
                {resList.map(item => (
                    <Link key={item.resSeq} href={`/view/${item.resSeq}`}>
                        <article>
                            <div>
                                {item.spendDate}
                            </div>
                            <div>
                                {fnGetCurrencyCodeView(item.amt)} &#8361;
                            </div>
                        </article>
                    </Link>
                ))}
            </section>
        </div>
    );
}