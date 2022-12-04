import { writeParameters } from "./internal/parameters/writeParameters.js";
import { ContentType } from "./types.js";

export async function serializeContentDisposition(
    contentType: ContentType
): Promise<string> {
    const res: string[] = [`${contentType.type}/${contentType.subtype}`];

    if (contentType.parameters) {
        res.push(await writeParameters(contentType.parameters));
    }

    return res.join("");
}
