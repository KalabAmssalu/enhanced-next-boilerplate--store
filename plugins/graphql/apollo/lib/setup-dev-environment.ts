import { logger } from '@KalabAmssalu/logger';
import { task } from '@KalabAmssalu/task';
import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

export interface DevEnvironmentConfig {
  installDependencies?: boolean;
  setupHusky?: boolean;
  generateTypes?: boolean;
  runLinting?: boolean;
  setupGitHooks?: boolean;
}

export class DevEnvironmentSetup {
  private config: DevEnvironmentConfig;

  constructor(config: DevEnvironmentConfig = {}) {
    this.config = {
      installDependencies: true,
      setupHusky: true,
      generateTypes: true,
      runLinting: true,
      setupGitHooks: true,
      ...config,
    };
  }

  public async setup(): Promise<void> {
    const setupTask = task.create(
      'Setting up GraphQL development environment',
      {
        spinner: 'dots',
        color: 'blue',
      }
    );

    try {
      setupTask.start();

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

      // Generate types
      if (this.config.generateTypes) {
        setupTask.update('Generating GraphQL types...');
        await this.generateTypes();
      }

      // Run linting
      if (this.config.runLinting) {
        setupTask.update('Running initial linting...');
        await this.runLinting();
      }

      setupTask.succeed('Development environment setup completed successfully');

      logger.success('GraphQL development environment is ready!', {
        features: [
          'GraphQL Codegen',
          'ESLint with GraphQL support',
          'Prettier formatting',
          'Husky Git hooks',
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

  private async generateTypes(): Promise<void> {
    try {
      // Create generated directory if it doesn't exist
      const generatedDir = 'lib/generated';
      if (!existsSync(generatedDir)) {
        mkdirSync(generatedDir, { recursive: true });
      }

      // Create a placeholder introspection file
      const introspectionPath = join(generatedDir, 'introspection.json');
      if (!existsSync(introspectionPath)) {
        const placeholderIntrospection = {
          __schema: {
            types: [],
            queryType: { name: 'Query' },
            mutationType: { name: 'Mutation' },
            subscriptionType: { name: 'Subscription' },
          },
        };
        writeFileSync(
          introspectionPath,
          JSON.stringify(placeholderIntrospection, null, 2)
        );
      }

      // Run codegen
      execSync('npm run graphql:codegen', { stdio: 'inherit' });
      logger.success('GraphQL types generated successfully');
    } catch (error) {
      logger.warn(
        'Failed to generate types (this is normal if GraphQL server is not running)'
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
        '1. Start your GraphQL server',
        '2. Update the schema URL in codegen.yml if needed',
        "3. Run 'npm run graphql:codegen' to generate types",
        "4. Run 'npm run lint:fix' to fix any linting issues",
        '5. Start developing with full type safety!',
      ],
    });

    logger.info('Available commands:', {
      commands: [
        'npm run graphql:codegen - Generate GraphQL types',
        'npm run graphql:codegen:watch - Watch mode for codegen',
        'npm run lint - Run ESLint',
        'npm run lint:fix - Fix ESLint issues',
        'npm run format - Format code with Prettier',
        'npm run graphql:validate - Validate GraphQL setup',
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
      case '--no-types':
        config.generateTypes = false;
        break;
      case '--no-lint':
        config.runLinting = false;
        break;
      case '--no-git':
        config.setupGitHooks = false;
        break;
    }
  }

  const setup = new DevEnvironmentSetup(config);
  setup.setup().catch(error => {
    logger.error('Setup failed:', error);
    process.exit(1);
  });
}
