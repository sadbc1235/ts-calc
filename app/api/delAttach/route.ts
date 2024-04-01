import fs from 'fs';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    const reqJson = await req.json();
    const {imgName} = reqJson;
    fs.unlinkSync(`./public/file/${imgName}`);
    return Response.json({status:"success", data: ''});
  } else {
    // Handle any other HTTP method
  }
}