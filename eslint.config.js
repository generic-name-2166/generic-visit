import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import oxlint from "eslint-plugin-oxlint";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: [
      ".git/*",
      ".jj/*",
      ".gitignore",
      "node_modules/*",
      "dist/*",
      "**/vite.config.ts",
      "**/bun.lock",
      "**/eslint.config.js",
      "worker-configuration.d.ts",
      "src/*.gen.ts",
    ],
  },
  prettier,
  oxlint.configs["flat/recommended"],
  ...oxlint.buildFromOxlintConfigFile("./.oxlintrc.json"),
);
