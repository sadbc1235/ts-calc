import Add from "../../../components/add"
import executeQuery from "../../_lib/db";


const getResInfo = async (resSeq) => {
    const sql = `
    SELECT
        emp_seq		AS empSeq
        , DATE_FORMAT(spend_date, '%Y-%m-%d')	AS spendDate
        , amt		AS amt
        , imgName	AS imgName
    FROM	res
    WHERE	res_seq = ?`;

    const data = await executeQuery(sql, [resSeq]);
    const dataJson = await JSON.parse(JSON.stringify(data));
    return dataJson
}

export default async function AddPage({params}) {
    const resInfo = await getResInfo(params.resSeq);

    return (
        <Add initMap={resInfo[0]}/>
    );
}