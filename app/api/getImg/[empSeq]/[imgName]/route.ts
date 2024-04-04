import { NextApiRequest } from "next";

export async function GET(req: NextApiRequest) {
  if (req.method === 'GET') {
    const {
      query: { empSeq, imgName }
    } = req;
    

    return '';
    // const reqJson = await req.json();
    // const {imgName} = reqJson;
    // let formdata = new FormData();
    // formdata.append("empSeq", imgName.empSeq);
    // formdata.append("imgName", imgName.imgName);

    // const res = await fetch(
    //   `http://${process.env.DB_HOST}:3000/delFile`
    //   , {
    //     method: 'POST'
    //     , headers: { 'Content-Type': 'application/json' }
    //     , body: JSON.stringify(imgName)
    //   }
    // );
    // const resJson = await res.json();

    // return resJson;
  } else {
    // Handle any other HTTP method
  }
}