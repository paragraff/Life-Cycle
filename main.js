require([
	'source/UserStories.class'
], function (UserStroies) {
	'use strict';


	var us = new UserStroies();
	us.get(
		function (stories) {console.dir(stories)},
		"(Project.Id eq 937) and (EndDate is not null) and " +
			"(EndDate gte '2014-04-01') and (StartDate lte '2014-04-30')",
		'[Id,Name,LeadTime]'
	);

});