import http from 'http';
import { iterateMultipart } from '@web3-storage/multipart-parser';

const boundaryRegex = /(?<=boundary=)(([^; \r\n]+)|("[^"]*"))/gi;

function getBoundary(contentType: string | undefined) {
  if (typeof contentType === 'undefined') throw new Error("No content-type specified.");

  const match = contentType.match(boundaryRegex);
  if(!match) {
    throw new Error(`No boundary found in content-type hader: ${contentType}.`);
  }

  let str = match[0];
  // string.prototype.startsWith not supported in IE11
  if (str.startsWith('"')) {
    str = str.substring(1, str.length - 2);
  }
  return str;
}

export interface FormPart {
  name: string;
  filename?: string;
  data: Uint8Array;
  mediaType?: string;
}

export function readForm(req: http.IncomingMessage): Promise<FormPart[]> {
  return new Promise(
    (resolve, reject) => {

      async function readFormFromBuffer(buffer: Buffer) {
        try {
          const boundary = getBoundary(req.headers['content-type']);

          const readableSream = new ReadableStream(
            {
              start(controller) {
                  controller.enqueue(buffer);
                  controller.close();
              }
            }
          )

          const parts = iterateMultipart(readableSream, boundary);

          const res: FormPart[] = []
          
          for await (const { name, data, filename, contentType } of parts) {
            res.push({ name, data: data, filename, mediaType: contentType });
          }

          resolve(res);
        }
        catch(err) {
          reject(err);
        }
      }

      const arrays: Uint8Array[] = [];
      req.on('data', (chunk: Uint8Array) => {
        arrays.push(chunk);
      });
      req.on('end', () => {
        try {
          const buffer = Buffer.concat(arrays);
          readFormFromBuffer(buffer);
        }
        catch(err) {
          reject(err);
        }
      });
      req.on('error', (err: any) => {
        reject(err);
      });
    }
  )
}

export async function writeFormData(res: http.ServerResponse, formData: FormPart[]) {
    const boundary = 'BOUNDARY-12341234123412341234$$';
    res.setHeader('Content-Type', `multipart/form-data; boundary=${boundary}`);

    res.writeHead(200);

    for (const { data, mediaType, name, filename } of formData) {
      res.write(`--${boundary}\r\n`);

      res.write('Content-Disposition: form-data');
      if (name) {
        res.write(`;name=${name}`);
      }
      if (filename) {
        res.write(`;filename=${filename}`);
      }
      // End of content-disposition
      res.write('\r\n')

      if (mediaType) {
        res.write(`Content-Type: ${mediaType}\r\n`);
      }

      // End of headers
      res.write('\r\n')

      res.write(data);

      res.write('\r\n');
    }

    res.write(`--${boundary}--`);
}
