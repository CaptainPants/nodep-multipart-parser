import { Header } from "../headers/index.js";

/**
 *
 */
export class FormDataRequestHttpContent {
    constructor(public headers: Header[], public formData: FormData) {}
}
