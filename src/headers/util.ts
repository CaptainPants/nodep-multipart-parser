import { ContentType, parseContentType } from ".";

export function isTextMediaType(mediaType: string) {
    if (mediaType.startsWith('text/')) {
        return true;
    }
    else if (mediaType.match(/^application\/(?:[^+]+\+)?(json|xml)/)) {
        return true;
    }

    return false;
}

export function isTextContentType(contentType: string | ContentType) {
    const contentTypeObj = typeof contentType == 'string' ? parseContentType(contentType) : contentType;

    return isTextMediaType(contentTypeObj.mediaType);
}