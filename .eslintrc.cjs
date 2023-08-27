module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended', // Ensures ESLint uses Prettier for code formatting and no ESLint rules conflict with prettier
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint'],
	rules: {
		'prettier/prettier': [
			'error',
			{
				// Ensure that your ESLint configuration uses the same rules as your Prettier configuration
				tabWidth: 4,
				useTabs: true,
				semi: true,
				singleQuote: true,
			},
		],
	},
	overrides: [
		{
			env: {
				node: true,
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script',
			},
		},
	],
};
