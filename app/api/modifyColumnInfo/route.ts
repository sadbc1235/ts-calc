import executeQuery from '../../_lib/db';
 
export async function POST(req: Request) {
  if (req.method === 'POST') {
    const reqJson = await req.json();
    const {modifyList} = reqJson;
      let result = {};

      let tableSql = ``;
      modifyList.forEach(async item => {
        tableSql = `ALTER TABLE custom.`+ item.tableName +` MODIFY `+ item.columnName +` `+ item.columnType +` COMMENT '`+ item.columnComment +`';`
        await executeQuery(tableSql, []);
      })

      result = {resultCode: 'SUCCESS'};

      return Response.json(JSON.parse(JSON.stringify(result)));
  } else {
    // Handle any other HTTP method
  }
}