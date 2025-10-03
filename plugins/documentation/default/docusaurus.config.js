import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Next.js Boilerplate",
  tagline: "Modern, production-ready Next.js monorepo boilerplate",
  favicon: "img/favicon.ico",

  url: "https://your-docs-site.com",
  baseUrl: "/",

  organizationName: "your-org",
  projectName: "next-boilerplate",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
          editUrl:
            "https://github.com/your-org/next-boilerplate/tree/main/docs/",
        },
        blog: {
          showReadingTime: true,
          editUrl:
            "https://github.com/your-org/next-boilerplate/tree/main/docs/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/docusaurus-social-card.jpg",
      navbar: {
        title: "Next.js Boilerplate",
        logo: {
          alt: "Next.js Boilerplate Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Docs",
          },
          { to: "/blog", label: "Blog", position: "left" },
          {
            href: "https://github.com/your-org/next-boilerplate",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Getting Started",
                to: "/docs/getting-started",
              },
              {
                label: "API Reference",
                to: "/docs/api",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Stack Overflow",
                href: "https://stackoverflow.com/questions/tagged/next-boilerplate",
              },
              {
                label: "Discord",
                href: "https://discordapp.com/invite/next-boilerplate",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/next-boilerplate",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Blog",
                to: "/blog",
              },
              {
                label: "GitHub",
                href: "https://github.com/your-org/next-boilerplate",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Next.js Boilerplate. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: [
          "bash",
          "diff",
          "json",
          "typescript",
          "javascript",
        ],
      },
      algolia: {
        appId: "YOUR_APP_ID",
        apiKey: "YOUR_SEARCH_API_KEY",
        indexName: "next-boilerplate",
        contextualSearch: true,
        searchParameters: {},
        searchPagePath: "search",
      },
    }),

  plugins: [
    [
      "@docusaurus/theme-mermaid",
      {
        mermaid: {
          theme: "default",
        },
      },
    ],
  ],

  markdown: {
    mermaid: true,
  },
};

export default config;
