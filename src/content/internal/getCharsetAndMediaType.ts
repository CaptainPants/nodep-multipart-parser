import { Header, parseContentType } from "../../headers/index.js";
import { arrayFind } from "../../internal/util/arrayFind.js";

export function getCharsetAndMediaType(
    headers: Header[]
): [
    charset: string | undefined,
    mediaType: string | undefined,
    boundary: string | undefined
] {
    const contentTypeRaw = arrayFind(
        headers,
        (x) => x.name.toLowerCase() == "content-type"
    )?.value;

    const contentType = contentTypeRaw
        ? parseContentType(contentTypeRaw)
        : undefined;

    if (!contentType) {
        return [undefined, undefined, undefined];
    }

    const lookup: Record<string, string> = {};
    contentType.parameters.forEach((x) => (lookup[x.lowerCaseName] = x.value));

    const charset = lookup["charset"];
    const boundary = lookup["boundary"];

    return [charset, `${contentType.type}/${contentType.subtype}`, boundary];
}
