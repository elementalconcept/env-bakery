// @ts-check
import eslint from "@eslint/js";
import angular from "angular-eslint";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": ["error", {
        type: "attribute",
        prefix: "app",
        style: "camelCase",
      }],
      "@angular-eslint/component-selector": ["error", {
        type: "element",
        prefix: "app",
        style: "kebab-case",
      }],
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
      }],
      "no-case-declarations": "off",
    },
  },
  {
    files: ["**/*.html"],
    extends: [angular.configs.templateRecommended],
    rules: {},
  },
  {
    files: ["projects/lib/**/*.ts"],
    rules: {
      "@angular-eslint/directive-selector": ["error", {
        type: "attribute",
        prefix: "lib",
        style: "camelCase",
      }],
      "@angular-eslint/component-selector": ["error", {
        type: "element",
        prefix: "lib",
        style: "kebab-case",
      }],
    },
  },
]);
