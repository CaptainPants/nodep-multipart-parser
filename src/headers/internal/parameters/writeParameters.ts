
import { Parameter, Parameters } from "../../types.js";
import { isQuoteSafe } from "../is.js";
import { writeExtendedValue } from "./writeExtendedValue.js";

// Refer https://datatracker.ietf.org/doc/html/rfc8187#section-3.1
// https://datatracker.ietf.org/doc/html/rfc9110#section-5.6.6 references 8187

export async function writeOneParameter(param: Parameter): Promise<string> {
    const res: string[] = [];

    if (param.name.length < 1) {
        throw new Error('Expected header name to have at least once character.');
    }

    const lastLetter = param.name[param.name.length - 1];
    const isExtended = lastLetter == '*';

    res.push('; ');
    res.push(param.name);
    res.push('=');

    if (isExtended) {
        res.push("utf-8'");
        if (param.language) res.push(param.language);
        res.push("'");
        res.push(await writeExtendedValue(param.value));
    }
    else {
        res.push('"');

        for (let i = 0; i < param.value.length; ++i) {
            const char = param.value[i];

            if (!isQuoteSafe(char)) {
                res.push('\\');
            }
            res.push(char);
        }
        res.push('"');
    }

    return res.join('');
}

export async function writeParameters(parameters: Parameters): Promise<string> {
    const res: string[] = [];

    for (const param of parameters) {
        res.push(await writeOneParameter(param));
    }

    return res.join('');
}

