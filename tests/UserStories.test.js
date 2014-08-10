define(['source/UserStories.class'], function(UserStories_class) {

describe("UserStories tests", function () {

	beforeEach(function () {

		this.user_stories = new UserStories_class();

	});

	afterEach(function () {

		delete this.user_stories;

	});

	describe("method get", function () {

		beforeEach(function () {

			this.jsonp_send = sinon.stub(Request.JSONP.prototype, "send");

			this.jsonp_initialize = sinon.spy(Request.JSONP.prototype, "initialize");

		});

		afterEach(function () {
			this.jsonp_send.restore();

		});

		it("по вызову get, отправляется запрос на нужный адрес", function () {

			var callback_stub = sinon.stub();

			this.user_stories.get(callback_stub, "Id eq 13", "[Id]");

			var url = new URI(this.jsonp_initialize.firstCall.args[0].url);

			expect(url.get('host')).to.be('owox.tpondemand.com');

			expect(this.jsonp_send.called).to.be.ok();

		});

	});


});

});