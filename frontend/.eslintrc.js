module.exports = {
  env: {
    browser: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: ['plugin:react/recommended'],
  plugins: ['react'],
  rules: {
    'react/prop-types': 0,
  },
};
