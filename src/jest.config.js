/** @type {import('ts-jest').JestConfigWithTsJest} */

export default {
    preset: 'ts-jest',
    resolver: "ts-jest-resolver",
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./test/jest-setup.ts']
    //testEnvironment: "./jest-environment.js"
};