import { ErrorBase } from "./ErrorBase.js";

export class CancelledError extends ErrorBase {
    constructor() {
        super('Operation cancelled.');
    }
    
}
