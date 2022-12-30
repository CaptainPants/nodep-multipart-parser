import { describe, expect, test } from "@jest/globals";
import { ParseError } from "../errors/index.js";
import { Parameter } from "./Parameter.js";

import { parseContentType } from "./parseContentType";

describe("parseContentType", () => {
    test("image/png", () => {
        const res = parseContentType("image/png");
        expect(res.type).toEqual("image");
        expect(res.subtype).toEqual("png");
        expect(Object.keys(res.parameters).length === 0);
    });

    test("image", () => {
        expect(() => parseContentType("image")).toThrow(ParseError);
    });

    test("text/json; encoding=utf-8", () => {
        const res = parseContentType("text/json; encoding=utf-8");

        expect(res.type).toEqual("text");
        expect(res.subtype).toEqual("json");
        expect(res.parameters).toEqual([new Parameter("encoding", "utf-8")]);
    });

    test('text/json; charset=utf-8 ; boundary="ham sandwich \\"1\\" 1234 "', () => {
        const res = parseContentType(
            'text/json; charset=utf-8 ; boundary="ham sandwich \\"1\\" 1234 "'
        );

        expect(res.type).toEqual("text");
        expect(res.subtype).toEqual("json");
        expect(res.parameters).toEqual([
            new Parameter("charset", "utf-8"),
            new Parameter("boundary", 'ham sandwich "1" 1234 '),
        ]);
    });

    test('text/json; charset="utf-8"', () => {
        const res = parseContentType('text/json; charset="utf-8"');

        expect(res.type).toEqual("text");
        expect(res.subtype).toEqual("json");
        expect(res.parameters).toEqual([new Parameter("charset", "utf-8")]);
    });
    test('text/json; charset="UTF-8"', () => {
        const res = parseContentType('text/json; charset="UTF-8"');

        expect(res.type).toEqual("text");
        expect(res.subtype).toEqual("json");
        expect(res.parameters).toEqual([new Parameter("charset", "UTF-8")]);
    });
});
