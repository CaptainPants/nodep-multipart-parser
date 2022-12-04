
export class HeaderParserState {
    constructor(
        string: string
    ) {
        this.#string = string;
        this.#index = 0;
        this.#end = string.length;
    }

    #string: string;
    #index: number;
    #end: number;

    /**
      * Get state as a plain object, mostly for unit testing.
      */
    toObject() {
        return {
            string: this.#string,
            index: this.#index,
            end: this.#end
        };
    }

    get string(): string {
        return this.#string;
    }

    current(): string | undefined {
        return this.#string[this.#index];
    }

    index(): number {
        return this.#index;
    }

    moveNext() {
        ++this.#index;
    }

    move(distance: number) {
        this.#index += distance;
    }

    set(index: number) {
        this.#index = index;
    }

    hasRemaining(number: number) {
        return this.#index + number <= this.#end;
    }

    isFinished() {
        return this.#index >= this.#end;
    }

    isAtCRLF() {
        if (!this.hasRemaining(2)) {
            return false;
        }

        return this.string.substring(this.#index, this.#index + 2) == '\r\n';
    }

    isAtUtf8() {
        if (!this.hasRemaining(5)) {
            return false;
        }

        return this.string.substring(this.#index, this.#index + 5).toLowerCase() == 'utf-8';
    }
}

