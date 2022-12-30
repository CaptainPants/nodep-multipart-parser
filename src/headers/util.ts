import { startsWith } from "../internal/util/startsWith.js";

export function isTextMediaType(mediaType: string | undefined) {
    if (mediaType === undefined) {
        return false;
    } else if (startsWith(mediaType, "text/")) {
        return true;
    } else if (mediaType.match(/^application\/(?:[^+]+\+)?(json|xml)/)) {
        return true;
    }

    return false;
}

export function isMultipartMediaType(mediaType: string | undefined) {
    if (mediaType === undefined) {
        return false;
    }

    return startsWith(mediaType, "multipart/");
}
