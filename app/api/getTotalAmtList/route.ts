import executeQuery from '../../_lib/db';
 
export async function POST(req: Request) {
  if (req.method === 'POST') {
      const reqJson = await req.json();
      // console.log('=============================req===============');
      // console.log(reqJson);
      // console.log('=============================req===============');
      const {date} = reqJson;
      const sql = `SELECT 
          emp.emp_seq	AS empSeq
          , emp.name	AS empName
          , IFNULL(SUM(res.amt), 0)	AS totalAmt
      FROM	ts_emp	emp

      LEFT JOIN	res res
      ON	emp.emp_seq	= res.emp_seq

      WHERE   IFNULL(res.spend_date, '')    LIKE CONCAT(?, '%')

      GROUP BY emp.emp_seq`;
      const data = await executeQuery(sql, [date]);
      return Response.json(JSON.parse(JSON.stringify(data)));
  } else {
    // Handle any other HTTP method
  }
}