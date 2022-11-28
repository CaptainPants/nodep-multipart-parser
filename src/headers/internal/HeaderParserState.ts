import { isSPOrVTAB } from "./is.js";

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

        return (
            this.string[this.#index] == "\r" &&
            this.string[this.#index + 1] == "\n"
        );
    }

    /**
      * Is the parser currently looking at an obs-fold value: CRLF ( SP / VTAB )
      */
    isAtObsFold() {
        if (!this.hasRemaining(3)) {
            return false;
        }

        return (
            this.string[this.#index] == "\r" &&
            this.string[this.#index + 1] == "\n" &&
            isSPOrVTAB(this.string[this.#index + 2])
        );
    }
}

