import { fnGetCurrencyCode } from "../app/constants";

export default function MainUserBox({empName, totalAmt}) {
    return (
        <article>
            <div>{empName}</div>
            <div>{fnGetCurrencyCode(totalAmt)} \</div>
        </article> 
    );
}