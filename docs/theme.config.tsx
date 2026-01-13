import React from "react";

export default {
  docsRepositoryBase:
    "https://github.com/rachelallyson/hero-hook-form/tree/main/docs/content",
  footer: {
    text: `© ${new Date().getFullYear()} Hero Hook Form`,
  },
  logo: <span>Hero Hook Form</span>,
  project: {
    link: "https://github.com/rachelallyson/hero-hook-form",
  },
  primaryHue: { dark: 200, light: 200 },
  // Enable breadcrumbs for better navigation
  breadcrumb: true,
  // Improve sidebar navigation
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  // Enable search with proper configuration
  search: {
    codeblocks: false,
    placeholder: "Search documentation…",
  },
  // Improve typography
  toc: {
    backToTop: true,
  },
  // Add edit link
  editLink: {
    component: null, // We'll customize this if needed
  },
  // Improve navigation
  navigation: {
    prev: true,
    next: true,
  },
};
