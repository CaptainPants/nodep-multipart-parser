import { describe, expect, test } from '@jest/globals';

import { parseHeaders } from './parseHeaders';

describe('parseHeaders', () => {
    test('test1', () => {
        const headers = `Content-Disposition: form-data; name="file2"; filename="a.html"
Content-Type: text/html`.replace(/\n/g, '\r\n');

        const res = parseHeaders({ headerString: headers }).headers;

        expect(res).toHaveLength(2);
        expect(res[0]!.name).toEqual('content-disposition');
        expect(res[0]!.value).toEqual('form-data; name="file2"; filename="a.html"');
        expect(res[1]!.name).toEqual('content-type');
        expect(res[1]!.value).toEqual('text/html');
    });

    test('obs-fold', () => {
        // note the content-disposition header is over two lines
        const headers = `Content-Disposition: form-data; name="file2";
 filename="a.html"
Content-Type: text/html`.replace(/\n/g, '\r\n');

        const res = parseHeaders({ headerString: headers }).headers;

        expect(res).toHaveLength(2);
        expect(res[0]!.name).toEqual('content-disposition');
        expect(res[0]!.value).toEqual('form-data; name="file2";  filename="a.html"');
        expect(res[1]!.name).toEqual('content-type');
        expect(res[1]!.value).toEqual('text/html');
    });
});