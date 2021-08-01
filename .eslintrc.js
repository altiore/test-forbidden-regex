module.exports = {
  env: {
    jest: true,
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  overrides: [
    {
      extends: ['prettier', 'plugin:prettier/recommended'],
      files: ['*.js', '*.jsx'],
      parser: '@babel/eslint-parser',
      parserOptions: {
        requireConfigFile: false,
      },
      plugins: ['prettier'],
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'ordered-imports'],
  root: true,
  rules: {
    'ordered-imports/ordered-imports': [
      'warn',
      {
        'group-ordering': [
          { match: '^color', name: 'color', order: 10 },
          { match: '^fs|^path', name: 'node', order: 20 },
          { match: '^\\./', name: 'current directory', order: 80 },
          { match: '.*', name: 'new unknown', order: 90 },
        ],
      },
    ],
    'sort-keys': [1, 'asc'],
  },
};
