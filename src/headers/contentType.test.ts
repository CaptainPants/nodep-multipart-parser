import { expect, test, describe } from "@jest/globals";

import { getBoundary } from ".";

describe('getBoundary', () => {
    test('multipart/form-data; boundary="example1-2-3"', () => {
        const boundary = getBoundary('multipart/form-data; boundary="example1-2-3"');

        expect(boundary).toEqual('example1-2-3');
    });
});