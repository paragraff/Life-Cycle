var timer = require("grunt-timer");

module.exports = function(grunt) {

	//получаем конфиги приложения (пока только токен авторизации)
	var app_config = grunt.file.readJSON('app_config.json');

	// Loading all grunt modules base on package.json
	require('load-grunt-tasks')(grunt);

	timer.init(grunt, {deferLogs: true, color: "red"});

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		jscs: {
			src:  "source/*.js",
			options: {
				"config": ".jscsconf",
				"additionalRules": [
					"node_modules/jscs-jsdoc/lib/rules/*.js"
				],
				"reporter": "inline"
			}
		},
		concat: {
			options: {
				separator: ';'
			},
			local: {
				src: ["source/libs/mootools-*.js", 'build/owox-*.js'],
				dest: 'build/core.js'
			}
		},
		watch: {
			files: ['source/*.class.js','tests/*.test.js' ,"*.js"],
			tasks: ['default', 'test-run'],
			options: {
				spawn: false
			}
		},
		requirejs: {
			"compile-main-local": {
				options: {
					baseUrl: "./",
					mainConfigFile: "main.js",
					include: ['main'],
					optimize: "none",//"uglify",
					out: "build/owox-main.js"
				}
			}
		},
		copy: {
			main: {
				src: 'build/core.js',
				dest: 'result/core.js'
			}
		},
		replace: {
			token: {
				options: {
					patterns: [
						{
							match: 'config_auth_token',
							replacement: app_config.token
						}
					]
				},
				files: [
					{
						expand: true,
						src: ['build/owox-*.js'],
						dest: './'
					}
				]
			}
		},
		bower: {
			install: {
				options: {
					targetDir: 'source/libs',
					copy: false,
					install: true,
					bowerOptions: {},
					verbose: true,
					cleanBowerDir: false,
					cleanTargetDir: false
				}
			}
		},
		clean: ['build'],
		karma: {
			options: {
				configFile: 'tests/karma.conf.js'
			},
			continuous: {
				singleRun: false
			},
			dev: {
				browser: ['PhantomJS'],
				singleRun: false,
				background: true
			}
		}
	});

	//таска для разработки.
	// Собираем файлы приложения в один, с учетом локальных зависимостей;
	//конфигурирем приложение; собираем приложение и библиотеки в один файл;
	//выкладываем итоговую сборку на место, где ее подтянет requirejs
	grunt.registerTask(
		'default',
		[
			'requirejs:compile-main-local',
			'replace',
			'concat:local',
			'copy',
			'clean'
		]
	);

	//вынес запуск тестов в отдельную таску из-за того, что запускать
	//карма-сервер и проверяльщика нужно раздельно. Так проверяльщик запустится
	//первый раз не после старта сервера, а после изменения файла.
	grunt.registerTask(
		'test-run', ['jscs','karma:dev:run']
	);

	//таска для начала разработки:
	//стартуем сервер автоматизации юнит-тестирования
	//собираем проект,
	//запускаем наблюдателя для пересборки и проверки проекта на лету
	grunt.registerTask(
		'start',
		[
			'karma:dev:start',
			'default',
			'watch'
		]
	);


};