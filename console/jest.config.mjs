/** @type {import('ts-jest').JestConfigWithTsJest} */
// jest.config.mjs (note the .mjs extension)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  testMatch: [
    "<rootDir>/tests/**/*.test.ts",
    "<rootDir>/tests/**/?(*.)+(spec|test).+(ts|tsx)"
  ],
};

export default config;
