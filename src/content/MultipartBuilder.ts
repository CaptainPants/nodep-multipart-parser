import { Data, DataSource } from "../data/index.js";
import {
    ContentDisposition,
    ContentType,
    Header,
    Parameter,
    serializeContentDisposition,
    serializeContentType,
} from "../headers/index.js";
import { generateBoundaryString } from "../internal/util/generateBoundaryString.js";
import { MultipartHttpContent } from "./MultipartHttpContent.js";
import { SingularHttpContent } from "./SingularHttpContent.js";

export interface MultipartBuilderPart {
    content: DataSource | Data;
    name?: string;
    filename?: string;
    mediaType?: string;
    /**
     * If content is a binary encoded string (ArrayBuffer, Blob, Dataview) this should contain the string
     * representation of what encoding was used, so that it can be safely converted back to a string.
     */
    sourceEncoding?: string;
}

interface MultipartBuilderPartExtended {
    content: Data;
    name?: string;
    filename?: string;
    mediaType?: string;
    size?: number;
}

export class MultipartBuilder {
    private _input: MultipartBuilderPartExtended[];

    /**
     *
     */
    constructor() {
        this._input = [];
    }

    public add(part: MultipartBuilderPart): void;
    public add({
        content,
        name,
        filename,
        mediaType,
        sourceEncoding,
    }: MultipartBuilderPart) {
        let size: number | undefined;

        if (content instanceof Blob) {
            if (!mediaType) {
                mediaType = content.type;
            }

            size = content.size;

            if (content instanceof File && !filename) {
                filename = content.name;
            }
        }

        this._input.push({
            content:
                content instanceof Data
                    ? content
                    : new Data(content, sourceEncoding, mediaType),
            name: name,
            filename: filename,
            size: size,
        });
    }

    public async build(): Promise<MultipartHttpContent> {
        const parts: SingularHttpContent[] = [];
        for (const { content, filename, mediaType, name, size } of this
            ._input) {
            const partHeaders: Header[] = [];

            const contentDisposition: ContentDisposition = {
                type: "form-data",
                parameters: [],
            };

            if (name || filename) {
                if (name) {
                    contentDisposition.parameters.push(
                        new Parameter("name", name)
                    );
                }
                if (filename) {
                    contentDisposition.parameters.push(
                        new Parameter("filename", filename)
                    );
                }
            }

            partHeaders.push(
                new Header(
                    "Content-Disposition",
                    await serializeContentDisposition(contentDisposition)
                )
            );

            if (typeof size !== "undefined") {
                partHeaders.push(new Header("Content-Length", String(size)));
            }

            if (mediaType) {
                const [type, subtype] = mediaType.split("/");

                partHeaders.push(
                    new Header(
                        "Content-Type",
                        await serializeContentType({
                            type,
                            subtype,
                            parameters: [],
                        })
                    )
                );
            }

            parts.push({
                data: content,
                headers: partHeaders,
            });
        }

        const boundaryString = generateBoundaryString();

        const contentType: ContentType = {
            type: "multipart",
            subtype: "form-data",
            parameters: [new Parameter("boundary", boundaryString)],
        };

        const result = new MultipartHttpContent(
            [
                new Header(
                    "Content-Type",
                    await serializeContentType(contentType)
                ),
            ],
            parts
        );

        return result;
    }
}
