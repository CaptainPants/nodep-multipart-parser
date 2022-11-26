import { Parameters } from '../types.js';


export function writeParameters(parameters: Parameters) {
    const res: string[] = [];

    for (const param of parameters) {
        res.push('; ');
        res.push(param.name);
        res.push('"');
        // TODO: this is totally not kosher
        res.push(encodeURIComponent(param.value));
        res.push('"');
    }

    return res.join('');
}