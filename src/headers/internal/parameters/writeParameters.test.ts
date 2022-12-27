import { describe, expect, test } from "@jest/globals";
import { Parameter } from "../../Parameter.js";

import { writeOneParameter } from "./writeParameters.js";

describe("writeOneParameter", () => {
    test('; filename="test.txt"', async () => {
        const param = new Parameter("filename", "test.txt");

        const res = await writeOneParameter(param);

        expect(res).toEqual("; filename=test.txt");
    });

    test('; filename="="', async () => {
        const param = new Parameter("filename", "=");

        const res = await writeOneParameter(param);

        expect(res).toEqual('; filename="="');
    });

    test("; filename*=utf-8'en'test.txt", async () => {
        const param = new Parameter("filename*", "£20.txt", "en");

        const res = await writeOneParameter(param);

        expect(res).toEqual("; filename*=utf-8'en'%C2%A320.txt");
    });
});
