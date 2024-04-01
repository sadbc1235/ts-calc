import executeQuery from '../../_lib/db';
 
export async function POST(req: Request) {
  if (req.method === 'POST') {
      const sql = `SELECT 
          emp.emp_seq	AS empSeq
          , emp.name	AS empName
      FROM	ts_emp	emp`;
      const data = await executeQuery(sql, []);
      return Response.json(JSON.parse(JSON.stringify(data)));
  } else {
    // Handle any other HTTP method
  }
}