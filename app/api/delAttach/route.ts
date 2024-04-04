export async function POST(req: Request) {
  if (req.method === 'POST') {
    const reqJson = await req.json();
    const {imgName} = reqJson;

    let formdata = new FormData();
    formdata.append("empSeq", imgName.empSeq);
    formdata.append("imgName", imgName.imgName);

    const res = await fetch(
      `http://${process.env.DB_HOST}:3000/delFile`
      , {
        method: 'POST'
        , headers: { 'Content-Type': 'application/json' }
        , body: JSON.stringify(imgName)
      }
    );
    const resJson = await res.json();

    return Response.json(resJson);
  } else {
    // Handle any other HTTP method
  }
}