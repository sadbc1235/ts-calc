import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from "util";

const pump = promisify(pipeline);

export async function POST(req) {
  if (req.method === 'POST') {
      const formData = await req.formData();
      const file = formData.getAll('files')[0]
      const filePath = `./file/${file.lastModified}-${file.name}`;
      await pump(file.stream(), fs.createWriteStream(filePath));
  
      // console.log('======================file=================')
      // console.log(file)
      // console.log('======================file=================')
      return Response.json({status:"success", data: {name: (file.lastModified +'-'+ file.name)}});
  } else {
    // Handle any other HTTP method
  }
}