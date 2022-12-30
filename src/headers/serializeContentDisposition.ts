import { writeParameters } from "./internal/parameters/writeParameters.js";
import { ContentDisposition } from "./types.js";

export async function serializeContentDisposition(
    contentDisposition: ContentDisposition
): Promise<string> {
    const res: string[] = [contentDisposition.type];

    if (contentDisposition.parameters) {
        res.push(await writeParameters(contentDisposition.parameters));
    }

    return res.join("");
}
