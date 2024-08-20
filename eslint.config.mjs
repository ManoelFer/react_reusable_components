//@ts-check
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettierConfigRecommended from 'eslint-plugin-prettier/recommended';

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  {
    ignores: ['.config/*', '!node_modules/', '.next', '.storybook'],
  },
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  prettierConfigRecommended,
  {
    rules: {
      'prefer-const': 2,
      'react/jsx-uses-react': 0,
      'react/react-in-jsx-scope': 0,
      '@typescript-eslint/no-misused-promises': 0,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
