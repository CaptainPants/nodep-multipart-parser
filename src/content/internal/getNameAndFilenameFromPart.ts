import { parseContentDisposition } from "../../headers/parseContentDisposition.js";
import { arrayFind } from "../../internal/util/arrayFind.js";
import { SingularHttpContent } from "../SingularHttpContent.js";

export function getNameAndFilenameFromPart(part: SingularHttpContent) {
    const header = arrayFind(
        part.headers,
        (x) => x.lowerCaseName == "content-disposition"
    )?.value;

    if (typeof header === "undefined") {
        return { name: undefined, filename: undefined };
    }

    const parsed = parseContentDisposition(header);
    const name = arrayFind(
        parsed.parameters,
        (x) => x.lowerCaseName === "name"
    )?.value;

    // filename* is considered higher priority, but we're supposed to allow fallback
    // as not everything supports extended parameters
    const filename =
        arrayFind(parsed.parameters, (x) => x.lowerCaseName === "filename*")
            ?.value ??
        arrayFind(parsed.parameters, (x) => x.lowerCaseName === "filename")
            ?.value;

    return { name, filename };
}
