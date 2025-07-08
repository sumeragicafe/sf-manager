import {defineFlatConfig} from 'eslint-define-config';

export default defineFlatConfig({
  rules: {
    // geral
    'semi': 'error', // obriga a usar ;
    'eqeqeq': 'error', // usar === em vez de ==
    'no-eval': 'error', // evita eval
    'no-labels': 'error', // não usar labels (goto)

    // tipagem & boas práticas
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    '@typescript-eslint/no-use-before-define': 'error',

    // variáveis
    'no-var': 'error', // proíbe var
    'prefer-const': 'error', // variáveis não reatribuídas devem ser const
    'no-const-assign': 'error', // não reatribuir const

    // strings
    'prefer-template': 'error', // usar template strings `${}`
    'no-useless-concat': 'error', // concatenação inútil

    // imports
    'no-duplicate-imports': 'error', // não duplicar imports
    'import/no-mutable-exports': 'error', // não exportar let
    'import/named': 'error', // verifica nomes dos imports
    'import/first': 'error', // imports no topo do arquivo
  },
});

