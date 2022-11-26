import { ContentDisposition } from ".";

export function serializeContentDisposition(contentDisposition: ContentDisposition) {
    const res: string[] = [contentDisposition.type];

    if (contentDisposition.parameters) {
        for (const param of contentDisposition.parameters) {
            res.push(';');
            res.push(param.name);
            res.push('"');
            res.push(encodeURIComponent(param.value));
            res.push('"');
        }
    }

    return res.join('');
}