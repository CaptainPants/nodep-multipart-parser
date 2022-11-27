import { describe, expect, test } from "@jest/globals";

import { readOneParameter } from './parameters.js';

describe("readOneParameter", () => {
    test("encoding=utf-8", () => {
        const input = "encoding=utf-8 ";
        const parameters: { [key: string]: string } = {};
        const res = readOneParameter({
            index: 0,
            end: input.length,
            string: input,
        });
        const keys = Object.keys(parameters);

        expect(res).toEqual({ name: "encoding", value: "utf-8" });
    });
});