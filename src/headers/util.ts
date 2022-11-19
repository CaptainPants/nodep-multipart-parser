import { ContentType, parseContentType } from ".";

export function isTextMediaType(mediaType: string | undefined) {
    if (mediaType === undefined) {
        return false;
    }
    else if (mediaType.startsWith('text/')) {
        return true;
    }
    else if (mediaType.match(/^application\/(?:[^+]+\+)?(json|xml)/)) {
        return true;
    }

    return false;
}

export function isTextContentType(contentType: string | ContentType | undefined) {
    if (contentType === undefined) return false;
    const contentTypeObj = typeof contentType == 'string' ? parseContentType(contentType) : contentType;

    return isTextMediaType(contentTypeObj.mediaType);
}