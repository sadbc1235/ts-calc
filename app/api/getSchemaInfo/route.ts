import executeQuery from '../../_lib/db';
 
export async function POST(req: Request) {
  if (req.method === 'POST') {
    const reqJson = await req.json();
    const {searchStr} = reqJson;
      let result = {};

      const tableSql = `
      SELECT
          table_name      AS tableName
          , table_comment AS tableComment
      FROM information_schema.TABLES WHERE table_schema = 'custom'`;

      const tableList = await executeQuery(tableSql, []);

      const colSql = `
      SELECT
            t1.TABLE_NAME       AS tableName
            , t1.TABLE_COMMENT  AS tableComment
            , t2.COLUMN_NAME    AS columnName
            , t2.COLUMN_COMMENT AS columnComment
            , t2.COLUMN_TYPE    AS columnType
        FROM (
            SELECT
                table_name, table_comment
            FROM information_schema.TABLES WHERE table_schema='custom'
        ) t1
        , (
            SELECT
                TABLE_NAME, COLUMN_NAME, DATA_TYPE, COLUMN_TYPE, COLUMN_KEY, IS_NULLABLE, COLUMN_DEFAULT, EXTRA, COLUMN_COMMENT, ORDINAL_POSITION, CHARACTER_MAXIMUM_LENGTH
            FROM information_schema.COLUMNS WHERE table_schema='custom'
        ) t2

        WHERE       t1.table_name       = t2.table_name
        AND         (
            t2.COLUMN_NAME      LIKE CONCAT('%', ?, '%')
            OR 
            t2.COLUMN_COMMENT   LIKE CONCAT('%', ?, '%')
        )

        ORDER BY    t1.table_name, ordinal_position`;

      const colList = await executeQuery(colSql, [searchStr, searchStr]);

      result['tableList'] = tableList;
      result['colList'] = colList;

      return Response.json(JSON.parse(JSON.stringify(result)));
  } else {
    // Handle any other HTTP method
  }
}