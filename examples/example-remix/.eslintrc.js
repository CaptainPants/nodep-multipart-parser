/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: [
        "@remix-run/eslint-config",
        "@remix-run/eslint-config/node",
        "plugin:@typescript-eslint/recommended",
        "plugin:eslint-comments/recommended"
    ],
    "parser": "@typescript-eslint/parser",
        "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 1
            }
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
