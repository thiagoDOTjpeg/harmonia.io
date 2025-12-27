import { readFileSync } from 'fs';
import type { Config } from 'jest';
import path from 'path';
import { pathsToModuleNameMapper } from 'ts-jest';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tsConfig = JSON.parse(readFileSync(path.resolve(__dirname, './tsconfig.json'), 'utf-8'));
const { compilerOptions } = tsConfig;

const config: Config = {
  coverageProvider: "v8",
  coverageDirectory: "coverage",
  collectCoverage: true,

  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/main/**",
    "!<rootDir>/src/**/index.ts",
    "!<rootDir>/src/tests/**",
    "!<rootDir>/src/types/**",
    "!<rootDir>/src/application/ports/**",
    "!<rootDir>/src/**/*.d.ts"
  ],

  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/src/"
  }),

  roots: ["<rootDir>/src"],

  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/"
  ],

  preset: "ts-jest",
};

export default config;
