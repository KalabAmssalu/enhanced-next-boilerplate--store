// Export configuration paths and utilities
export const configPaths = {
  eslint: './configs/eslint.js',
  eslintReact: './configs/eslint-react.js',
  eslintNextjs: './configs/eslint-nextjs.js',
  typescript: './configs/typescript.json',
  tailwind: './configs/tailwind.js',
  prettier: './configs/prettier.json',
  jest: './configs/jest.config.js',
  playwright: './configs/playwright.config.js',
} as const;

export type ConfigType = keyof typeof configPaths;

export function getConfigPath(config: ConfigType): string {
  return configPaths[config];
}

export function getConfigPaths(): Record<ConfigType, string> {
  return { ...configPaths };
}
