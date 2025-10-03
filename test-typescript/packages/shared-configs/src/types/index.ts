export interface ConfigOptions {
  extends?: string[];
  rules?: Record<string, any>;
  plugins?: string[];
  settings?: Record<string, any>;
  env?: Record<string, boolean>;
  parserOptions?: Record<string, any>;
}

export interface ESLintConfig extends ConfigOptions {
  extends: string[];
  rules: Record<string, any>;
  plugins: string[];
  settings: Record<string, any>;
  env: Record<string, boolean>;
  parserOptions: Record<string, any>;
}

export interface TypeScriptConfig {
  compilerOptions: Record<string, any>;
  include: string[];
  exclude: string[];
  references?: Array<{ path: string }>;
}

export interface TailwindConfig {
  content: string[];
  theme: Record<string, any>;
  plugins: string[];
  darkMode?: string | boolean;
}

export interface PrettierConfig {
  semi: boolean;
  trailingComma: string;
  singleQuote: boolean;
  printWidth: number;
  tabWidth: number;
  useTabs: boolean;
}

export interface JestConfig {
  preset: string;
  testEnvironment: string;
  setupFilesAfterEnv: string[];
  moduleNameMapping: Record<string, string>;
  collectCoverageFrom: string[];
  coverageDirectory: string;
  coverageReporters: string[];
}

export interface PlaywrightConfig {
  testDir: string;
  fullyParallel: boolean;
  forbidOnly: boolean;
  retries: number;
  workers: number;
  reporter: string;
  use: Record<string, any>;
  projects: Array<Record<string, any>>;
}


