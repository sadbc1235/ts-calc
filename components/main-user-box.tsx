import Link from "next/link";
import { fnGetCurrencyCodeView } from "../app/constants";

export default function MainUserBox({empSeq, empName, totalAmt, date}) {
    return (
        <Link href={!!totalAmt ? `/report/${empSeq}?date=${date}` : '/report'}>
            <article>
                <div>{empName}</div>
                <div>{fnGetCurrencyCodeView(totalAmt)} &#8361;</div>
            </article> 
        </Link>
    );
}