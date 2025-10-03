module.exports = {
  // TypeScript and JavaScript files
  '*.{ts,tsx,js,jsx}': ['eslint --fix', 'prettier --write'],

  // GraphQL files
  '*.graphql': ['prettier --write --parser graphql'],

  // JSON files
  '*.json': ['prettier --write --parser json'],

  // YAML files
  '*.{yml,yaml}': ['prettier --write --parser yaml'],

  // Markdown files
  '*.md': ['prettier --write --parser markdown'],

  // MDX files
  '*.mdx': ['prettier --write --parser mdx'],

  // CSS and SCSS files
  '*.{css,scss,sass}': ['prettier --write'],

  // Package.json files
  'package.json': ['prettier --write --parser json'],

  // All other files
  '*.{html,svg}': ['prettier --write'],
};


