/**
 * boundary      := 0*69<bchars> bcharsnospace
 * bcharsnospace := DIGIT / ALPHA / "'" / "(" / ")" /
 *                  "+" / "_" / "," / "-" / "." /
 *                  "/" / ":" / "=" / "?"
 * bchars        := bcharsnospace / " "
 */
const boundaryCharacters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'()+_,-./:=?";

export function generateBoundaryString(prefix = "BOUNDARY-", length = 69) {
    let str = prefix;

    while (str.length < length) {
        str +=
            boundaryCharacters[
                Math.floor(Math.random() * boundaryCharacters.length)
            ];
    }

    return str;
}
