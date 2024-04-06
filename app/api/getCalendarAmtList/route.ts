import executeQuery from '../../_lib/db';
 
export async function POST(req: Request) {
  if (req.method === 'POST') {
      const reqJson = await req.json();
      const {prevDate, curDate} = reqJson;
      const sql = `
      SELECT 
        GROUP_CONCAT(res_seq)	AS resSeqs
        , DATE_FORMAT(spend_date, '%Y-%m-%d')	AS spendDate
        , SUM(amt)	AS amt
      FROM	res
      WHERE	(
        spend_date	LIKE CONCAT(?, '%')
        OR
        spend_date	LIKE CONCAT(?, '%')
      )

      GROUP BY spend_date
      ;`;

      const data = await executeQuery(sql, [prevDate, curDate]);
      return Response.json(JSON.parse(JSON.stringify(data)));
  } else {
    // Handle any other HTTP method
  }
}