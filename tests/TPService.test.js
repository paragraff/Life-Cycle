define(['source/TPService.class'], function(TPService_class) {

describe("TPService tests", function () {

	beforeEach(function () {

		this.user_stories = new TPService_class();

	});

	afterEach(function () {

		delete this.user_stories;

	});

	describe("method get", function () {

		var json_response;
		beforeEach(function () {
			/*
			эта переменная будет в тесте содержать json ответ сервера.
			заполняем ее перед вызовом, который приведет к запросу на сервер
			и получаем результат после обработки его тестируемым классом
			*/
			json_response = null;

			this.jsonp_stub = sinon.stub(
				Request.JSONP.prototype,
				"getScript",
				function (url) {
					var request_func_name = new URI(url).get('data').callback;
					var response = json_response.shift()||{};
					var injected_element = new Element('script', {
						type: 'text/javascript',
						text: request_func_name + '('+ JSON.encode(response) + ')'
					});
					return injected_element;
				}
			);
			this.jsonp_initialize = sinon.spy(Request.JSONP.prototype, "initialize");
		});

		afterEach(function () {
			this.jsonp_stub.restore();
			this.jsonp_initialize.restore();
		});

		it("по вызову get, отправляется запрос на нужный адрес", function () {

			json_response = [{Items:[]}];

			this.user_stories.get("UserStories", Function.from(), "Id eq 13", "[Id]");

			var url = new URI(this.jsonp_initialize.firstCall.args[0].url);

			expect(url.get('host')).to.be('owox.tpondemand.com');

			expect(url.get('directory')).to.be('/api/v1/UserStories/');

		});

		it(
			"по завершению получения данных, вызывается переданный коллбек",
			function () {
				json_response = [{Items:[]}];
				var callback_spy = sinon.spy();
				this.user_stories.get("UserStories", callback_spy, "Id eq 13", "[Id]");
				expect(callback_spy.calledWith({stories:[]})).to.be.ok();
			}
		);

		it(
			'Если ответ сервера не поместился в одну пачку - запросы должны закольцовываться',
			function ()  {
				json_response = [
					{
						"Next": "https://some_url.com",
						"Items": [{"Id": 24776}, {"Id": 24752}]
					},
					{
						"Items": [{"Id": 24777}]
					}
				];
				var callback_spy = sinon.spy();
				this.user_stories.get("UserStories", callback_spy, "Id eq 13", "[Id]");
				//с сервера получены все три сущности
				expect(callback_spy.firstCall.args[0].stories.length).to.be(3);
				//сущности были получены в два захода
				expect(this.jsonp_stub.callCount).to.be(2);
			}
		)
	});
});
});