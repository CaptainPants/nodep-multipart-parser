import { describe, expect, test } from "@jest/globals";

import { parseContentDisposition } from "./parseContentDisposition";

describe("parseContentDisposition", () => {
    test("form-data", () => {
        const res = parseContentDisposition("form-data");
        expect(res.type).toEqual("form-data");
        expect(Object.keys(res.parameters).length === 1);
    });

    test('form-data; filename="test.txt"', () => {
        const res = parseContentDisposition('form-data; filename="test.txt"');

        expect(res.type).toEqual("form-data");
        expect(res.parameters[0].name).toEqual("filename");
        expect(res.parameters[0].value).toEqual("test.txt");
    });

    test("form-data; name=example-name-1 ; filename=example-filename-1", () => {
        const res = parseContentDisposition(
            "form-data; name=example-name-1 ; filename=example-filename-1"
        );

        expect(res.type).toEqual("form-data");
        expect(res.parameters).toEqual([
            { name: "name", value: "example-name-1" },
            { name: "filename", value: "example-filename-1" },
        ]);
    });
});
