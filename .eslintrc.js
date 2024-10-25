module.exports = {
  parser: '@babel/eslint-parser',
  extends: ['standard', 'prettier/flowtype', 'prettier'],
  rules: {},
  globals: {
    test: false,
    expect: false,
  },
}
