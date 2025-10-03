module.exports = {
  extends: ["./eslint-react.js", "next/core-web-vitals"],
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "@next/next/no-img-element": "warn",
    "@next/next/no-page-custom-font": "warn",
  },
};


