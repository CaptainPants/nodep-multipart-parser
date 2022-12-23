import { describe, expect, test } from "@jest/globals";

import { Header } from '../types.js';
import { measureHeaders } from './measureHeaders.js';

test("basic", () => {
    const headers: Header[] = [
        // 12 + 1 + 10 + 2 = 25
        { name: 'content-type', value: 'text/plain' },
        // 14 + 1 + 3 + 2  = 20
        { name: 'content-length', value: '100' }
    ];
    // +2 CRLF at the end = 47

    const result = measureHeaders(headers);

    expect(result).toEqual(47);
});