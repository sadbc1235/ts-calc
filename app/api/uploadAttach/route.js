export async function POST(req) {
  if (req.method === 'POST') {
      const resData = await req.formData();
      const file = resData.getAll('files')[0];
      const empSeq = resData.get('empSeq');
      console.log(empSeq)
      let formdata = new FormData();
      formdata.append("file", file);
      formdata.append("empSeq", empSeq);

      const res = await fetch(
        `http://${process.env.DB_HOST}:3000/upload`
        , {
          method: 'POST'
          , body: formdata
        }
      );

      const resJson = await res.json();
      return Response.json(resJson);
  } else {
    // Handle any other HTTP method
  }
}