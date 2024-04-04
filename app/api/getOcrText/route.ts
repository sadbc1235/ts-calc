export async function POST(req: Request) {
  if (req.method === 'POST') {
      const reqJson = await req.json();
      const {url} = reqJson;
      // console.log(url)
      const res = await fetch(
        'https://z9gfm9c88b.apigw.ntruss.com/custom/v1/29692/0d12c857d6cce0a0f909d224aa26af5e4547c481d5ba5a9ce2f750dcd82b1223/general'
        , {
          method: 'POST'
          , headers: { 'Content-Type': 'application/json', 'X-OCR-SECRET': 'dGtKeEN1aG10WVJ1RG5UaXZoV2Vzbm5nV1FPSFdpSEY=' }
          , body: JSON.stringify({
              "images": [
                {
                  "format": 'jpg',
                  "name": "medium",
                  "data": null,
                  "url": `http://${process.env.DB_HOST}:3000${url}`
                }
              ],
              "lang": "ko",
              "requestId": "string",
              "resultType": "string",
              "timestamp": Date.now(),
              "version": "V1"
          })
        }
      );
      const resJson = await res.json();

      return Response.json(resJson);
  } else {
    // Handle any other HTTP method
  }
}