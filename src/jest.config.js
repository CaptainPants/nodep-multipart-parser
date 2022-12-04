/** @type {import('ts-jest').JestConfigWithTsJest} */

export default {
    preset: 'ts-jest',
    resolver: "ts-jest-resolver",
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./test/jest-setup.ts'],
    maxWorkers: 2
    //testEnvironment: "./jest-environment.js"
};