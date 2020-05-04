module.exports = {
  parserOptions: {
    project: './tsconfig.json',
    // allows eslint from any dir
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  ignorePatterns: ['dist/', 'rollup.config.js', 'bin/run.js', 'types/'],
  extends: [
    '../.eslintrc.cjs',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {
    'import/default': 'off',
    'import/no-unresolved': 'off',
    'filenames/match-regex': ['error', '^[a-z0-9\\-]+$', true],
    'filenames/match-exported': ['error', 'kebab'],
  },
};
