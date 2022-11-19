import { ContentType, parseContentType } from ".";
import { ParseError } from "..";

function resolve(contentType: string | ContentType) {
    try {
        return typeof contentType == 'object' ? contentType : parseContentType(contentType);
    }
    catch (ex) {
        throw new ParseError(`Error parsing header. ${ex instanceof Error ? ex.message : ex}`);
    }
}

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
    const contentTypeObj = resolve(contentType);

    return isTextMediaType(contentTypeObj.mediaType);
}

export function getBoundary(contentType: string | ContentType) {
    let contentTypeObject = resolve(contentType);

    const boundaryIndex = contentTypeObject.parameters.findIndex(item => item.name == 'boundary');
    if (boundaryIndex < 0) {
        throw new ParseError('Could not find boundary parameter.');
    }
    const boundary = contentTypeObject.parameters[boundaryIndex];

    return boundary.value;
}

export function getEncoding(contentType: string | ContentType) {
    let contentTypeObject = resolve(contentType);

    const boundaryIndex = contentTypeObject.parameters.findIndex(item => item.name == 'boundary');
    if (boundaryIndex < 0) {
        throw new ParseError('Could not find boundary parameter.');
    }
    const boundary = contentTypeObject.parameters[boundaryIndex];

    return boundary.value;
}