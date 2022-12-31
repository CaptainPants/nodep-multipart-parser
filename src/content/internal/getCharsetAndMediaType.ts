import { Header, parseContentType } from "../../headers/index.js";
import { arrayFind } from "../../internal/util/arrayFind.js";

export function getCharsetAndMediaType(headers: Header[]): {
    charset?: string;
    mediaType?: string;
    type?: string;
    subtype?: string;
    boundary?: string;
} {
    const contentTypeRaw = arrayFind(
        headers,
        (x) => x.name.toLowerCase() == "content-type"
    )?.value;

    const contentType = contentTypeRaw
        ? parseContentType(contentTypeRaw)
        : undefined;

    if (!contentType) {
        return {};
    }

    const lookup: Record<string, string> = {};
    contentType.parameters.forEach((x) => (lookup[x.lowerCaseName] = x.value));

    const charset = lookup["charset"];
    const boundary = lookup["boundary"];

    return {
        charset,
        mediaType: `${contentType.type}/${contentType.subtype}`,
        type: contentType.type,
        subtype: contentType.subtype,
        boundary,
    };
}
