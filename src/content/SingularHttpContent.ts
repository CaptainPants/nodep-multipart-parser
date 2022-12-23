import { Data } from "../data/index.js";
import { type Header } from "../headers/index.js";

export class SingularHttpContent {
    constructor(public headers: Header[], public data: Data) {}

    static empty(): SingularHttpContent {
        return new SingularHttpContent([], Data.empty());
    }
}