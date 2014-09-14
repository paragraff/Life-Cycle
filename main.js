require([
	'source/TPService.class',
	'https://www.google.com/jsapi'
], function (TPService) {
	'use strict';

	var ChartController = new Class({

		Binds: ['_getStories', '_loadChart', 'callChain'],

		Implements: Chain,

		initialize: function () {

			this.chain(
				this._loadChart,
				this._getStories,
				this._draw
			);

			this.callChain();


		},

		_loadChart: function () {

			google.load(
				"visualization",
				"1.0",
				{packages: ["timeline"], "callback": this.callChain}
			);

		},

		_getStories: function () {

			var us = new TPService();
			us.get(
				"UserStories",
				this.callChain,
				"(Project.Id eq 937) and (EndDate is not null) and " +
					"(EndDate gte '2014-04-01') and (StartDate lte '2014-04-30')",
				'[Id,Name,LeadTime]'
			);

		},

		_draw: function (stories) {

			var chart = new google.visualization.Timeline($('chart'));

			var dataTable = new google.visualization.DataTable();

			dataTable.addColumn({ type: 'string', id: 'Name' });
			dataTable.addColumn({ type: 'date', id: 'Start' });
			dataTable.addColumn({ type: 'date', id: 'End' });

			stories.stories.each(function (story) {

				var create, end;

				create = new Date(
					parseInt(story.CreateDate.replace(/\/Date\(|\+[0-9]{4}\)\//g, ''))
				);

				end = new Date(
					parseInt(story.EndDate.replace(/\/Date\(|\+[0-9]{4}\)\//g, ''))
				);

				dataTable.addRow([story.Name, create, end]);

			});

			chart.draw(dataTable);

		}

	});

	var ctrl = new ChartController();

});