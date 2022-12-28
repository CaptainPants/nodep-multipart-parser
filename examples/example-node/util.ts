import http from 'http';
import * as parse from 'parse-multipart-data';

export function readForm(req: http.IncomingMessage): Promise<ReturnType<typeof parse.parse>> {
  return new Promise(
    (resolve, reject) => {
      const boundary = parse.getBoundary(req.headers['content-type']!);

      const arrays: Uint8Array[] = [];
      req.on('data', (chunk: Uint8Array) => {
        arrays.push(chunk);
      });
      req.on('end', () => {
        const buffer = Buffer.concat(arrays);
        const parts = parse.parse(buffer, boundary);
        resolve(parts);
      });
      req.on('error', (err: any) => {
        reject(err);
      });
    }
  )
}

export function writeFormData(res: http.ServerResponse formData: ReturnType<typeof parse.parse>) {
    const boundary = 'BOUNDARY-12341234123412341234$$';
    res.setHeader('Content-Type', `multipart/form-data; boundary=${boundary}`);

    res.writeHead(200);

    for (const { data, type, name, filename } of formData) {
      res.write(`--${boundary}\r\n`);

      res.write('Content-Disposition: form-data');
      if (name) {
        res.write(`;name=${name}`);
      }
      if (filename) {
        res.write(`;filename=${filename}`);
      }

      if (type) {
        res.write(`Content-Type: ${type}\r\n`);
      }
      res.write('\r\n')
      res.write(data);

      res.write('\r\n');
    }

    res.write(`--${boundary}--`);
}