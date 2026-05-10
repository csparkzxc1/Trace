module.exports = {
  root: true,
  extends: ["expo"],
  ignorePatterns: [
    "node_modules/",
    ".expo/",
    "dist/",
    "build/",
    "admin/",
    "supabase/functions/",
    "assets/web/",
    "*.config.js",
    "render-mockups.mjs",
  ],
  rules: {
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
  },
};
