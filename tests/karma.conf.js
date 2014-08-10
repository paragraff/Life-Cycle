module.exports = function (config) {
	config.set({
		basePath: '../',
		frameworks: ['mocha', 'requirejs', 'expect', 'sinon'],
		browsers: ['PhantomJS', 'Chrome'],
		files: [
			'source/libs/*.js',
			'tests/main.require.js',
			{pattern: 'source/*.class.js', included: false},
			{pattern: 'tests/*.test.js', included: false}
		],
		reporters: ['mocha'],
		singleRun: true,
		autoWatch: false,
		logLevel: 'ERROR'
	})
};
