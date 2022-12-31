import { HttpContent, isMultipartContent } from "../content/index.js";
import { HttpError } from "./HttpError.js";
import { HttpRequest, HttpResponse, HttpResponseDataType } from "./types.js";
import { isArrayBuffer } from "../internal/util/isArrayBuffer.js";
import { generateBoundaryString } from "../internal/util/generateBoundaryString.js";
import { serializeContentType } from "../headers/serializeContentType.js";
import { parseContentType } from "../headers/parseContentType.js";
import { ContentType } from "../headers/types.js";
import { arrayFind } from "../internal/util/arrayFind.js";
import { Parameter } from "../headers/Parameter.js";

/**
 * Nice promise-based interface to XMLHttpRequest. Tries to hide all the weirdness.
 */
export class HttpClient {
    async request(request: HttpRequest): Promise<HttpResponse> {
        const { formData: formDataOptimization } = request.optimizations ?? {
            formData: false,
        };

        // Refer to standard: https://xhr.spec.whatwg.org/
        const xhr = new XMLHttpRequest();

        if (typeof request.timeout !== "undefined") {
            xhr.timeout = request.timeout;
        }

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

        const responseType = request.responseType ?? "arraybuffer";

        const { data, replacementContentType } = await this._prepareData(
            request.content,
            responseType,
            formDataOptimization
        );

        const replacementContentTypeString = replacementContentType
            ? await serializeContentType(replacementContentType)
            : undefined;

        await this._wrapInPromise(xhr, () => {
            xhr.open(request.method, request.url);

            if (request.content) {
                for (const header of request.content.headers) {
                    // Skip content-type (if a replacement is provided) as it has special handling to cater to multi-part content
                    if (
                        replacementContentTypeString &&
                        header.name == "content-type"
                    ) {
                        continue;
                    }

                    xhr.setRequestHeader(header.name, header.value);
                }

                if (replacementContentTypeString) {
                    xhr.setRequestHeader(
                        "Content-Type",
                        replacementContentTypeString
                    );
                }
            }

            xhr.responseType = responseType;

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
    _wrapInPromise(xhr: XMLHttpRequest, openAndSend: () => void) {
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

            // Do not await this as it will deadlock
            openAndSend();
        });
    }

    async _prepareData(
        content: HttpContent | undefined,
        type: HttpResponseDataType,
        formDataOptimization: boolean
    ): Promise<{
        data: FormData | Blob | ArrayBuffer | string | undefined;
        replacementContentType?: ContentType;
    }> {
        if (!content) {
            return { data: undefined };
        }

        if (isMultipartContent(content)) {
            const contentTypeString = arrayFind(
                content.headers,
                (x) => x.lowerCaseName == "content-type"
            )?.value;

            let foundContentType: ContentType | undefined;
            if (contentTypeString) {
                foundContentType = parseContentType(contentTypeString);
            }

            // Ensure that we have a boundary string
            const { replacementContentType, boundary } =
                prepareContentTypeForMultipart(foundContentType);

            let data: ArrayBuffer | FormData;

            if (formDataOptimization) {
                data = await content.toFormData();
            } else {
                data = await content.toArrayBuffer(boundary);
            }

            return {
                data: data,
                replacementContentType: replacementContentType,
            };
        } else {
            let data: Blob | ArrayBuffer | Blob | string | undefined;

            if (!content.data || content.data.isEmpty()) {
                data = undefined;
            }

            if (type === "text") {
                data = await content.data.string();
            } else {
                if (
                    content.data.source instanceof Blob ||
                    isArrayBuffer(content.data.source)
                ) {
                    data = content.data.source;
                } else {
                    data = (await content.data.arrayBuffer()).value;
                }
            }

            return { data };
        }
    }
}

function prepareContentTypeForMultipart(originalContentType?: ContentType): {
    replacementContentType?: ContentType;
    boundary: string;
} {
    if (originalContentType) {
        const foundBoundary = arrayFind(
            originalContentType.parameters,
            (x) => x.lowerCaseName == "boundary"
        )?.value;

        if (foundBoundary) {
            return {
                boundary: foundBoundary,
            };
        }

        const boundary = generateBoundaryString();

        // Copy existing content-type and add the new boundary to it
        const replacementContentType = {
            ...originalContentType,
            parameters: originalContentType.parameters.concat(
                new Parameter("boundary", boundary)
            ),
        };

        return { replacementContentType, boundary };
    } else {
        const boundary = generateBoundaryString();

        const replacementContentType = {
            type: "multipart",
            subtype: "form-data",
            parameters: [new Parameter("boundary", boundary)],
        };

        return { replacementContentType, boundary };
    }
}
