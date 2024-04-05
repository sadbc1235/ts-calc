import executeQuery from '../../_lib/db';
 
export async function POST(req: Request) {
  if (req.method === 'POST') {
      const reqJson = await req.json();
      const {empSeq, spendDate, amt, imgName} = reqJson;
      const sql = `
      INSERT INTO res (
        emp_seq
        , spend_date
        , amt
        , imgName
        , create_seq
        , modify_seq
      ) VALUES (
        ?
        , ?
        , ?
        , ?
        , ?
        , ?
      )`;

      await executeQuery(sql, [empSeq, spendDate, amt, imgName, empSeq, empSeq]);
      return Response.json({type: 'success'});
  } else {
    // Handle any other HTTP method
  }
}