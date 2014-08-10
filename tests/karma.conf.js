module.exports = function (config) {
	config.set({
		basePath: '../',
		frameworks: ['mocha', 'requirejs', 'expect', 'sinon'],
		browsers: ['PhantomJS', 'Chrome'],
		client: {
			mocha: {
				ui: 'bdd',
				reporter: 'nyan'
			}
		},
		files: [
			'source/libs/*.js',
			'tests/main.require.js',
			{pattern: 'source/*.class.js', included: false},
			{pattern: 'tests/*.test.js', included: false}
		],
		reporters: ['mocha'],
		singleRun: false,
		autoWatch: false,
		logLevel: 'ERROR'
	})
};
