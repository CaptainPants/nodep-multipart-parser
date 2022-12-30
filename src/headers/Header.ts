export class Header {
    constructor(name: string, value: string) {
        this._name = name;
        this._lowerCaseName = name.toLowerCase();
        this.value = value;
    }

    private _name: string;
    private _lowerCaseName: string;

    public get name() {
        return this._name;
    }
    public set name(name: string) {
        this._name = name;
        this._lowerCaseName = name.toLowerCase();
    }

    /**
     * The header name normalised to lowercase, useful for searching for a particular header.
     */
    public get lowerCaseName() {
        return this._lowerCaseName;
    }

    public value: string;
}
