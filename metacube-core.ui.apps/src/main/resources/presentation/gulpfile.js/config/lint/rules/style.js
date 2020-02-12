module.exports = {
    rules: {
        // this option sets a specific tab width for your code
        // http://eslint.org/docs/rules/indent
        'indent': [2, 4],

        // disallow un-paren'd mixes of different operators
        // http://eslint.org/docs/rules/no-mixed-operators
        'no-mixed-operators': 'off',

        // enforce padding within blocks
        'padded-blocks': ['error', {
            'blocks': 'never',
            'classes': 'never',
            'switches': 'never'
        }]
    }
};
