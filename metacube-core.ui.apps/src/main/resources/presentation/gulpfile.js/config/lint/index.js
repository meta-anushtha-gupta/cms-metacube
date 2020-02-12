module.exports = {
    extends: [
        './rules/errors',
        './rules/imports',
        './rules/style',
    ].map(require.resolve),
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
    },
    rules: {
        strict: 2,
    },
};
