import http from 'http';
import file from 'fs/promises';
import { readForm, writeFormData } from './util';

const handlers: Record<string, http.RequestListener<typeof http.IncomingMessage, typeof http.ServerResponse>> = {
  "/": (req, res) => {
    res.writeHead(200);
    res.end(`
      <!doctype html>
      <html>
        <head>
          <script src="/script.js"></script>
        </head>
        <body>
          <button id="button">Test</button>
          <script>
            function runTest() {
              var builder = new zerodepsMultipartParser.MultipartBuilder();
              builder.add({
                name: 'test1',
                data: new zerodepsMultipartParser.Data('Test content'),
                mediaType: 'text/plain'
              });
              builder.build()
                .then(
                  function(content) {
                    var client = new zerodepsMultipartParser.HttpClient();
                    return client.request({
                      url: '/echo',
                      method: 'POST',
                      content: content
                    });
                  }
                )
                .then(
                  result => {
                    alert(result);
                  },
                  err => {
                    alert(err);
                  }
                );
              }
            document.getElementById('button').addEventListener('click', runTest);
          </script>
        </body>
      </html>
    `);
  },
  "/script.js": async (req, res) => {
    const content = await file.readFile('../../dist/umd/zerodeps-multipart-parser.js');
    res.setHeader('Content-Type', 'text/javascript');
    res.writeHead(200);
    res.end(content);
  },
  "/echo": async (req, res) => {
    const parts = await readForm(req);

    writeFormData(res, parts);

    res.end();
  }
};

const requestListener = function (req: http.IncomingMessage, res: http.ServerResponse) {
  const path = req.url ?? "/";
  const handler = handlers[path];

  console.log(`${req.method} ${req.url}`);

  if (!handler) {
    res.writeHead(404);
    res.end();
    return;
  }

  return handler(req, res);
}

console.log('Listening at http://localhost:3001. Ctrl+C to end.');
const server = http.createServer(requestListener);
server.listen(3001);