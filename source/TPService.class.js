define([], function () {
	'use strict';

	var TPServiceClass = new Class({

		Implements: [Options, Events],

		options: {
			url: 'https://owox.tpondemand.com/api/v1/',
			token: '@@config_auth_token',
			format: 'json',
			limit: 500
		},

		initialize: function (options) {

			this.setOptions(options);

			this._url = new URI(this.options.url);

			this._url.setData({
				format: this.options.format,
				take: this.options.limit
			});

		},

		/**
		 * Метод вызовет переданный коллбек с набором сущностей, удовлетворяющим условиям выборки
		 * @public
		 * @param {string} entityName Название сущности (UserStory, Project, etc)
		 * @param {function} callback Функция, которая будет вызвана после получения набора
		 * @param {string} where строка условий выборки, согласно REST API сервиса (http://dev.targetprocess.com/rest/response_format)
		 * @param {Array.<string>} fields набор полей сущности для возврата
		 */
		get: function (entityName, callback, where, fields) {

			this._url.set('directory', this._url.get('directory') + entityName + '/');

			var uri = new URI(this._url.toString()),
				entities = [];

			if (where) {
				uri.setData('where', where);
			}
			if (fields) {
				uri.setData('include', fields);
			}
			this.addEvent('_allPart', callback);
			this._getPart(uri.toString(), entities);
		},

		_requestData: function (url, action, callback) {

			new Request.JSONP({
				headers: this.options.headers,
				action: action,
				url: new URI(url).setData('token', this.options.token).toString(),
				callbackKey: 'callback',
				onComplete: callback
			}).send();

		},

		_getPart: function (url, allStories) {

			if (url) {

				this._requestData(
					url,
					'get',
					function (partStories) {

						var nextUrl = undefined, dataUrl;

						if (partStories.Next) {

							/* у TP eсть привычка тулить каллбек функцию в Next,
							а у mootools привычка тулить разные коллбеки для
							каждого запроса. Приходится вырезать из Next вызов
							коллбека, потому что mootools сам добавляет свой
							вызов.
							*/
							nextUrl = new URI(partStories.Next);

							dataUrl = nextUrl.getData();

							delete dataUrl.callback;

							nextUrl.setData(dataUrl, false);

						}

						allStories.append(partStories.Items);

						this._getPart(nextUrl, allStories);

					}.bind(this)
				);

			} else {

				this.fireEvent('_allPart', {stories:allStories});

			}

		}

	});

	return TPServiceClass;

});
