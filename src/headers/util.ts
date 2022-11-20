

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

export function isMultipartMediaType(mediaType: string | undefined) {
    if (mediaType === undefined) {
        return false;
    }

    return mediaType.startsWith('multipart/');
}