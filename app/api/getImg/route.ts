export async function GET(req: Request) {
  if (req.method === 'GET') {
    const query = req.url.split('?')[1].split('&');
    const empSeq = query[0].split('=')[1];
    const imgName = query[1].split('=')[1];

    let formdata = new FormData();
    formdata.append("empSeq", empSeq);
    formdata.append("imgName", imgName);

    const res = await fetch( `http://${process.env.DB_HOST}:3000/file/${empSeq}/${imgName}` );

    return res;
  } else {
    // Handle any other HTTP method
  }
}