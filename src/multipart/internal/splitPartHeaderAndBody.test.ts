import { describe, expect, test } from "@jest/globals";

import { splitPartHeaderAndBody } from "./splitPartHeaderAndBody.js";
import { asciiToDataViewForTesting } from "./util.js";

describe("splitPartHeaderAndBody", () => {
    test("test1", () => {
        const part =
            asciiToDataViewForTesting(`Content-Disposition: form-data; name="file2"; filename="b.html"\r
\r
test2-1234\r
`);
        const { headers, content } = splitPartHeaderAndBody(part);

        expect(headers).toEqual(
            'Content-Disposition: form-data; name="file2"; filename="b.html"\r\n\r\n'
        );

        const decoder = new TextDecoder();
        const decoded = decoder.decode(content);

        const expectedString = "test2-1234\r\n";
        expect(decoded).toHaveLength(expectedString.length);
        expect(decoded).toEqual(expectedString);
    });
});
