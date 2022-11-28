import { writeParameters } from "./internal/parameters.js";
import { ContentType } from "./types.js";

export function serializeContentType(contentType: ContentType) {
    const res: string[] = [`${contentType.type}/${contentType.subtype}`];

    if (contentType.parameters) {
        res.push(writeParameters(contentType.parameters));
    }

    return res.join("");
}
