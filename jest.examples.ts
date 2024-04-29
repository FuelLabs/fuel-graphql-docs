import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node',
  testMatch: ['**/examples/tests/*.test.ts'],
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testTimeout: 100000,
  verbose: true,
  moduleNameMapper: {
    // Maps all imports starting with "~/" to the correct directory
    '^~/(.*)$': '<rootDir>/$1',
  },
};

export default config;
