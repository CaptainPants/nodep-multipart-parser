import { describe, expect, test } from "@jest/globals";
import { Parameter } from "../../types.js";

import { writeOneParameter } from "./writeParameters.js";

describe("writeOneParameter", () => {
    test('; filename="test.txt"', async () => {
        const param: Parameter = { name: "filename", value: "test.txt" };

        const res = await writeOneParameter(param);

        expect(res).toEqual('; filename="test.txt"');
    });

    test("; filename*=utf-8'en'test.txt", async () => {
        const param: Parameter = {
            name: "filename*",
            value: "£20.txt",
            language: "en",
        };

        const res = await writeOneParameter(param);

        expect(res).toEqual("; filename*=utf-8'en'%C2%A320.txt");
    });
});
