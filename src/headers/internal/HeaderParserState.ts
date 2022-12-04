
export class HeaderParserState {
    constructor(
        string: string
    ) {
        this._string = string;
        this._index = 0;
        this._end = string.length;
    }

    private _string: string;
    private _index: number;
    private _end: number;

    /**
      * Get state as a plain object, mostly for unit testing.
      */
    toObject() {
        return {
            string: this._string,
            index: this._index,
            end: this._end
        };
    }

    get string(): string {
        return this._string;
    }

    current(): string | undefined {
        return this._string[this._index];
    }

    index(): number {
        return this._index;
    }

    moveNext() {
        ++this._index;
    }

    move(distance: number) {
        this._index += distance;
    }

    set(index: number) {
        this._index = index;
    }

    hasRemaining(number: number) {
        return this._index + number <= this._end;
    }

    isFinished() {
        return this._index >= this._end;
    }

    /**
      * Is the next sequence of characters equal to that provided. Note that this is a case 
      * insensitive comparison.
      */
    isAt(str: string) {
        if (!this.hasRemaining(str.length)) {
            return false;
        }

        return this.string.substring(this._index, this._index + str.length).toLowerCase() === str.toLowerCase();
    }
}

