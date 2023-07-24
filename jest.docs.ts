import type { JestConfigWithTsJest } from 'ts-jest';
import { defaultsESM as tsjPreset } from 'ts-jest/presets';

const config: JestConfigWithTsJest = {
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  rootDir: __dirname,
  transform: tsjPreset.transform,
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node',
  testMatch: ['./**/*.test.ts'],
  testRunner: 'jest-circus/runner',
  testPathIgnorePatterns: ["/node_modules/", "/examples/"],
  verbose: true,
};

export default config;

