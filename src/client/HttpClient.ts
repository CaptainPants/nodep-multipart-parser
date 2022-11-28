import { HttpContent } from "../content/HttpContent.js";
import { HttpError } from "./HttpError.js";
import { HttpRequest, HttpResponse, HttpResponseDataType } from "./types.js";
import { SingularHttpContent } from "../content/index.js";
import { isArrayBuffer } from "../util/index.js";

/**
 * Nice promise-based interface to XMLHttpRequest. Tries to hide all the weirdness.
 */
export class HttpClient {
    async request(request: HttpRequest): Promise<HttpResponse> {
        // Refer to standard: https://xhr.spec.whatwg.org/
        const xhr = new XMLHttpRequest();

        if (request.abort) {
            request.abort.addEventListener("abort", () => {
                xhr.abort();
            });
        }

        // According to https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/upload
        // the event handlers need to be added before 'open'
        // even though the standard indicates it should be
        // between open and send.

        // https://xhr.spec.whatwg.org/#upload-object
        if (typeof xhr.upload != "undefined" && request.onUploadProgress) {
            xhr.upload.addEventListener("progress", request.onUploadProgress);
        }

        if (request.onDownloadProgress) {
            xhr.addEventListener("progress", request.onDownloadProgress);
        }

        const data = await this.#prepareData(
            request.content,
            request.responseType
        );

        await this.#wrapInPromise(xhr, () => {
            xhr.open(request.method, request.url);

            for (const header of request.content.headers) {
                xhr.setRequestHeader(header.name, header.value);
            }

            // TODO add content type header if not in headers list

            xhr.responseType = request.responseType;

            xhr.send(data);
        });

        if (xhr.status == 0) {
            // This is probably a network error, or firefox triggering
            // abort from navigation.
            // According to the spec, when there is an error xhr.response
            // should be an error object. We might as well use that.
            // The type will be DOMException with:
            // - Network error -> code = 19 (NETWORK_ERR)
            // - Abort error -> code = 20 (ABORT_ERR)
            // - There may be other kinds of errors that a badly assembled
            // XHR can throw (https://webidl.spec.whatwg.org/#idl-DOMException)
            // There are other kinds of errors as well.
            throw xhr.response;
        } else {
            const response: HttpResponse = {
                status: xhr.status,
                statusText: xhr.statusText,
                content: await HttpContent.fromXHRResponse(xhr),
                raw: xhr,
            };

            if (request.isValidStatus) {
                if (!request.isValidStatus(response.status)) {
                    throw new HttpError(response);
                }
            } else if (xhr.status >= 400) {
                throw new HttpError(response);
            }

            return response;
        }
    }

    /**
     * Wrap the XHR request as a promise. Doesn't return anything, just
     * resolves if the request ended properly, rejects with a DOMException AbortError
     * if it was aborted.
     */
    #wrapInPromise(xhr: XMLHttpRequest, openAndSend: () => void) {
        return new Promise((resolve, reject) => {
            xhr.addEventListener("loadend", () => {
                resolve(void 0);
            });
            // Wasn't immediately clear to me if this fires before or after
            // load end. We're making sure that a load end with status of 0
            // throws a CancelledError anyway.
            xhr.addEventListener("abort", () => {
                reject(new DOMException("Aborted", "AbortError"));
            });

            openAndSend();
        });
    }

    async #prepareData(
        content: SingularHttpContent,
        type: HttpResponseDataType
    ): Promise<Blob | ArrayBuffer | Blob | string | undefined> {
        if (!content.data || content.data.isEmpty()) {
            return undefined;
        }

        // TODO: Multipart and optimisation to use FormData if not additional headers provided
        if (type === "text") {
            return await content.data.string();
        } else {
            if (
                content.data.source instanceof Blob ||
                isArrayBuffer(content.data.source)
            ) {
                return content.data.source;
            } else {
                return (await content.data.arrayBuffer()).value;
            }
        }
    }
}
