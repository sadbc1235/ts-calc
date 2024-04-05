import executeQuery from '../../_lib/db';
 
export async function POST(req: Request) {
  if (req.method === 'POST') {
      const reqJson = await req.json();
      const {date} = reqJson;
      const sql = `
      SELECT 
        emp.emp_seq	AS empSeq
        , emp.name	AS empName
        , (
          SELECT
            IFNULL(SUM(res.amt), 0)
          FROM	res
          WHERE	emp_seq	= emp.emp_seq
          AND	IFNULL(res.spend_date, '')    LIKE CONCAT(?, '%')
        )	AS totalAmt
      FROM	ts_emp	emp

      GROUP BY emp.emp_seq`;

      const data = await executeQuery(sql, [date]);
      return Response.json(JSON.parse(JSON.stringify(data)));
  } else {
    // Handle any other HTTP method
  }
}