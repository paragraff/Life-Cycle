require([
	'source/UserStories.class'
], function (UserStroies) {
	'use strict';


	var us = new UserStroies();
	us.get(
		function (stories) {console.dir(stories)},
		"(Project.Id eq 937) and (EndDate is not null) and (EndDate lt '2014-04-01')",
		'[Id]'
	);

});