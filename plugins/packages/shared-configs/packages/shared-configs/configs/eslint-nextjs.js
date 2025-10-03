module.exports = {
  extends: ['./eslint-react.js'],
  rules: {
    // Next.js specific rules
    '@next/next/no-html-link-for-pages': 'off',
    '@next/next/no-img-element': 'off',
    'react/no-unescaped-entities': 'off',
  },
};
