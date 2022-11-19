
import { describe, expect, test } from '@jest/globals';
import { asciiToDataViewForTesting, getAsciiStringFromDataView, getCharCodesForString } from './internal';
import { MultipartParser, __testing } from "./MultipartParser";

describe('parse', () => {
    test('example1', () => {
        const boundary = '9051914041544843365972754266';

        const dataview = asciiToDataViewForTesting(`
--9051914041544843365972754266
Content-Disposition: form-data; name="text"

text default
--9051914041544843365972754266
Content-Disposition: form-data; name="file1"; filename="a.txt"
Content-Type: text/plain

Content of a.txt.

--9051914041544843365972754266
Content-Disposition: form-data; name="file2"; filename="a.html"
Content-Type: text/html

<!DOCTYPE html><title>Content of a.html.</title>

--9051914041544843365972754266--`);

        const parser = new MultipartParser();

        const result = parser.parse(boundary, dataview).parts;

        expect(result).toHaveLength(3);
        expect(result[0]!.headers).toHaveLength(1);
        expect(result[0]!.headers[0]!.name).toEqual('content-disposition');
        expect(result[0]!.headers[0]!.value).toEqual('form-data; name="text"');

        expect(result[1]!.headers).toHaveLength(2);
        expect(result[1]!.headers[0]!.name).toEqual('content-disposition');
        expect(result[1]!.headers[0]!.value).toEqual('form-data; name="file1"; filename="a.txt"');
        expect(result[1]!.headers[1]!.name).toEqual('content-type');
        expect(result[1]!.headers[1]!.value).toEqual('text/plain');

        expect(result[2]!.headers).toHaveLength(2);
        expect(result[2]!.headers[0]!.name).toEqual('content-disposition');
        expect(result[2]!.headers[0]!.value).toEqual('form-data; name="file2"; filename="a.html"');
        expect(result[2]!.headers[1]!.name).toEqual('content-type');
        expect(result[2]!.headers[1]!.value).toEqual('text/html');
    });
});

describe('splitPartHeaderAndBody', () => {
    test('test1', () => {
        const part = asciiToDataViewForTesting(`Content-Disposition: form-data; name="file2"; filename="b.html"

test2-1234
`);
        const { headers, content } = __testing!.splitPartHeaderAndBody(part);

        expect(headers).toEqual('Content-Disposition: form-data; name="file2"; filename="b.html"');

        const decoder = new TextDecoder();
        const decoded = decoder.decode(content);

        const expectedString = 'test2-1234\r\n';
        expect(decoded).toHaveLength(expectedString.length);
        expect(decoded).toEqual(expectedString);
    });
});

describe('findParts', () => {
    test('test1', () => {
        const boundary = '9051914041544843365972754266';

        const dataview = asciiToDataViewForTesting(`
--9051914041544843365972754266
Content-Disposition: form-data; name="file1"; filename="a.html"

test1
--9051914041544843365972754266
Content-Disposition: form-data; name="file2"; filename="b.html"

test2
--9051914041544843365972754266--`); // string literals use \n

        const result = __testing!.findParts(getCharCodesForString(boundary), dataview);

        expect(result).toHaveLength(2);

        const first = result[0]!;
        expect(getAsciiStringFromDataView(first)).toEqual('Content-Disposition: form-data; name="file1"; filename="a.html"\r\n\r\ntest1');

        const second = result[1]!;
        expect(getAsciiStringFromDataView(second)).toEqual('Content-Disposition: form-data; name="file2"; filename="b.html"\r\n\r\ntest2');
    });
});
