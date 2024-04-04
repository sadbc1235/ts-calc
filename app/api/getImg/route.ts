export async function GET(req: Request) {
  if (req.method === 'GET') {
    const query = req.url.split('?')[1].split('&');
    const empSeq = query[0].split('=')[1];
    const imgName = query[1].split('=')[1];

    const res = await fetch( 
      `http://${process.env.DB_HOST}:3000/file/${empSeq}/${imgName}` 
      , {
        method: 'POST'
        , headers: { 'Content-Type': 'application/json' }
        , body: JSON.stringify({empSeq: empSeq, imgName: imgName})
      }
    );

    return res;
  } else {
    // Handle any other HTTP method
  }
}