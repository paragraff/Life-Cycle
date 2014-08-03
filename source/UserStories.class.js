define([
	'./TPEntities.class'
], function (TPEntities_class) {
	'use strict';

var UserStories_class = new Class({

	Extends: TPEntities_class,

	Implements: [Options, Events],

	options: {
		url: "https://owox.tpondemand.com/api/v1/UserStories",
		token: '@@config_auth_token',
		format: 'json',
		limit: 500
	},

	initialize: function(options) {

		this.setOptions(options);

		this._url = new URI(this.options.url);

		this._url.setData({
			"format": this.options.format,
			"take": this.options.limit
		});

	},

	get: function (callback, where, fields) {

		var uri = new URI(this._url.toString());

		if (where) {

			uri.setData('where', where);

		}

		if (fields) {

			uri.setData('include', fields);

		}

		this.addEvent('_allPart', callback);

		var user_stories = [];

		this._getPart(uri.toString(), user_stories);

	},

	_requestData: function (url, action, callback) {

		new Request.JSONP({
			headers: this.options.headers,
			action: action,
			url: new URI(url).setData("token", this.options.token).toString(),
			callbackKey: 'callback',
			onComplete: callback
		}).send();

	},

	_getPart: function (url, all_stories) {

		if (url) {

			this._requestData(
				url,
				"get",
				function (part_stories) {

					var next_url = undefined, data_url;

					if (part_stories.Next) {

						/* у TP eсть привычка тулить каллбек функцию в Next,
						 а у mootools привычка тулить разные коллбеки для
						 каждого запроса. Приходится вырезать из Next вызов
						 коллбека, потому что mootools сам добавляет свой
						 вызов.
						 * */
						next_url = new URI(part_stories.Next);

						data_url = next_url.getData();

						delete data_url.callback;

						next_url.setData(data_url, false);

					}

					all_stories.append(part_stories.Items);

					this._getPart(next_url, all_stories);

				}.bind(this)
			);

		} else {

			this.fireEvent('_allPart', {stories:all_stories});

		}

	}

});

return UserStories_class;

});