import { logger } from '@KalabAmssalu/logger';
import { task } from '@KalabAmssalu/task';
import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

export interface DevEnvironmentConfig {
  installDependencies?: boolean;
  setupHusky?: boolean;
  runLinting?: boolean;
  setupGitHooks?: boolean;
  createConfigFiles?: boolean;
}

export class DevEnvironmentSetup {
  private config: DevEnvironmentConfig;

  constructor(config: DevEnvironmentConfig = {}) {
    this.config = {
      installDependencies: true,
      setupHusky: true,
      runLinting: true,
      setupGitHooks: true,
      createConfigFiles: true,
      ...config,
    };
  }

  public async setup(): Promise<void> {
    const setupTask = task.create('Setting up development environment', {
      spinner: 'dots',
      color: 'blue',
    });

    try {
      setupTask.start();

      // Create config files
      if (this.config.createConfigFiles) {
        setupTask.update('Creating configuration files...');
        await this.createConfigFiles();
      }

      // Install dependencies
      if (this.config.installDependencies) {
        setupTask.update('Installing dependencies...');
        await this.installDependencies();
      }

      // Setup Husky
      if (this.config.setupHusky) {
        setupTask.update('Setting up Husky...');
        await this.setupHusky();
      }

      // Setup Git hooks
      if (this.config.setupGitHooks) {
        setupTask.update('Setting up Git hooks...');
        await this.setupGitHooks();
      }

      // Run linting
      if (this.config.runLinting) {
        setupTask.update('Running initial linting...');
        await this.runLinting();
      }

      setupTask.succeed('Development environment setup completed successfully');

      logger.success('Development environment is ready!', {
        features: [
          'ESLint with TypeScript and React support',
          'Prettier code formatting',
          'Husky Git hooks',
          'Lint-staged for staged files',
          'TypeScript strict mode',
        ],
      });

      this.printNextSteps();
    } catch (error) {
      setupTask.fail('Failed to setup development environment');
      logger.error('Development environment setup failed:', error);
      throw error;
    }
  }

  private async createConfigFiles(): Promise<void> {
    try {
      // Create .eslintrc.json if it doesn't exist
      if (!existsSync('.eslintrc.json')) {
        const eslintConfig = {
          root: true,
          env: {
            browser: true,
            es2021: true,
            node: true,
          },
          extends: [
            'eslint:recommended',
            'plugin:@typescript-eslint/recommended',
            'plugin:react/recommended',
            'plugin:react-hooks/recommended',
            'plugin:jsx-a11y/recommended',
            'plugin:import/recommended',
            'plugin:import/typescript',
            'prettier',
          ],
          parser: '@typescript-eslint/parser',
          parserOptions: {
            ecmaFeatures: {
              jsx: true,
            },
            ecmaVersion: 12,
            sourceType: 'module',
            project: ['./tsconfig.json'],
          },
          plugins: [
            'react',
            '@typescript-eslint',
            'react-hooks',
            'jsx-a11y',
            'import',
            'prettier',
          ],
          settings: {
            react: {
              version: 'detect',
            },
            'import/resolver': {
              typescript: {
                project: ['./tsconfig.json'],
              },
              node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
              },
            },
          },
          rules: {
            'prettier/prettier': 'error',
            'react/react-in-jsx-scope': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': [
              'warn',
              { argsIgnorePattern: '^_' },
            ],
            'react/prop-types': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'import/no-unresolved': 'error',
            'import/order': [
              'error',
              {
                groups: [
                  'builtin',
                  'external',
                  'internal',
                  'parent',
                  'sibling',
                  'index',
                  'object',
                  'type',
                ],
                'newlines-between': 'always',
                alphabetize: {
                  order: 'asc',
                  caseInsensitive: true,
                },
              },
            ],
          },
          overrides: [
            {
              files: ['*.js'],
              rules: {
                '@typescript-eslint/no-var-requires': 'off',
              },
            },
          ],
        };
        writeFileSync('.eslintrc.json', JSON.stringify(eslintConfig, null, 2));
      }

      // Create .prettierrc if it doesn't exist
      if (!existsSync('.prettierrc')) {
        const prettierConfig = {
          semi: true,
          trailingComma: 'es5',
          singleQuote: true,
          printWidth: 80,
          tabWidth: 2,
          useTabs: false,
          endOfLine: 'lf',
          arrowParens: 'always',
          bracketSpacing: true,
          jsxBracketSameLine: false,
          jsxSingleQuote: false,
          quoteProps: 'as-needed',
          vueIndentScriptAndStyle: false,
          embeddedLanguageFormatting: 'auto',
          htmlWhitespaceSensitivity: 'css',
          proseWrap: 'preserve',
        };
        writeFileSync('.prettierrc', JSON.stringify(prettierConfig, null, 2));
      }

      // Create .prettierignore if it doesn't exist
      if (!existsSync('.prettierignore')) {
        const prettierIgnore = `# Ignore artifacts
build
dist
.next
.turbo
coverage
.env
.env.local
.env.development.local
.env.production.local

# Ignore logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Ignore node_modules
node_modules

# Ignore generated files
lib/generated/*
`;
        writeFileSync('.prettierignore', prettierIgnore);
      }

      // Create .lintstagedrc.js if it doesn't exist
      if (!existsSync('.lintstagedrc.js')) {
        const lintStagedConfig = `module.exports = {
  // TypeScript and JavaScript files
  '*.{ts,tsx,js,jsx}': ['eslint --fix', 'prettier --write'],

  // JSON files
  '*.json': ['prettier --write --parser json'],

  // YAML files
  '*.{yml,yaml}': ['prettier --write --parser yaml'],

  // Markdown files
  '*.md': ['prettier --write --parser markdown'],

  // CSS and SCSS files
  '*.{css,scss,sass}': ['prettier --write'],

  // Package.json files
  'package.json': ['prettier --write --parser json'],

  // All other files
  '*.{html,svg}': ['prettier --write'],
};
`;
        writeFileSync('.lintstagedrc.js', lintStagedConfig);
      }

      // Create tsconfig.json if it doesn't exist
      if (!existsSync('tsconfig.json')) {
        const tsConfig = {
          extends: '../../tsconfig.json',
          compilerOptions: {
            target: 'es2021',
            lib: ['dom', 'dom.iterable', 'esnext'],
            allowJs: true,
            skipLibCheck: true,
            strict: true,
            forceConsistentCasingInFileNames: true,
            noEmit: true,
            esModuleInterop: true,
            module: 'esnext',
            moduleResolution: 'node',
            resolveJsonModule: true,
            isolatedModules: true,
            jsx: 'preserve',
            incremental: true,
            baseUrl: '.',
            paths: {
              '@/*': ['./*'],
            },
          },
          include: [
            'next-env.d.ts',
            '**/*.ts',
            '**/*.tsx',
            '**/*.js',
            '**/*.jsx',
          ],
          exclude: ['node_modules'],
        };
        writeFileSync('tsconfig.json', JSON.stringify(tsConfig, null, 2));
      }

      logger.success('Configuration files created successfully');
    } catch (error) {
      logger.error('Failed to create configuration files:', error);
      throw error;
    }
  }

  private async installDependencies(): Promise<void> {
    try {
      logger.info('Installing development dependencies...');
      execSync('npm install', { stdio: 'inherit' });
      logger.success('Dependencies installed successfully');
    } catch (error) {
      logger.error('Failed to install dependencies:', error);
      throw error;
    }
  }

  private async setupHusky(): Promise<void> {
    try {
      // Create .husky directory if it doesn't exist
      const huskyDir = '.husky';
      if (!existsSync(huskyDir)) {
        mkdirSync(huskyDir, { recursive: true });
      }

      // Make pre-commit hook executable
      const preCommitPath = join(huskyDir, 'pre-commit');
      if (existsSync(preCommitPath)) {
        execSync(`chmod +x ${preCommitPath}`);
      }

      // Make pre-push hook executable
      const prePushPath = join(huskyDir, 'pre-push');
      if (existsSync(prePushPath)) {
        execSync(`chmod +x ${prePushPath}`);
      }

      logger.success('Husky setup completed');
    } catch (error) {
      logger.error('Failed to setup Husky:', error);
      throw error;
    }
  }

  private async setupGitHooks(): Promise<void> {
    try {
      // Initialize Husky
      execSync('npx husky install', { stdio: 'inherit' });
      logger.success('Git hooks setup completed');
    } catch (error) {
      logger.warn(
        'Failed to setup Git hooks (this is normal if not in a Git repository)'
      );
    }
  }

  private async runLinting(): Promise<void> {
    try {
      execSync('npm run lint', { stdio: 'inherit' });
      logger.success('Linting completed successfully');
    } catch (error) {
      logger.warn("Linting found issues (run 'npm run lint:fix' to fix them)");
    }
  }

  private printNextSteps(): void {
    logger.info('Next steps:', {
      steps: [
        '1. Review the generated configuration files',
        "2. Run 'npm run lint:fix' to fix any linting issues",
        "3. Run 'npm run format' to format your code",
        '4. Start developing with full type safety and linting!',
      ],
    });

    logger.info('Available commands:', {
      commands: [
        'npm run lint - Run ESLint',
        'npm run lint:fix - Fix ESLint issues',
        'npm run format - Format code with Prettier',
        'npm run format:check - Check code formatting',
        'npm run type-check - Run TypeScript type checking',
        'npm run dev:setup - Setup development environment',
      ],
    });
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const config: DevEnvironmentConfig = {};

  // Parse command line arguments
  for (const arg of args) {
    switch (arg) {
      case '--no-deps':
        config.installDependencies = false;
        break;
      case '--no-husky':
        config.setupHusky = false;
        break;
      case '--no-lint':
        config.runLinting = false;
        break;
      case '--no-git':
        config.setupGitHooks = false;
        break;
      case '--no-config':
        config.createConfigFiles = false;
        break;
    }
  }

  const setup = new DevEnvironmentSetup(config);
  setup.setup().catch(error => {
    logger.error('Setup failed:', error);
    process.exit(1);
  });
}
