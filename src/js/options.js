/**/

(function($) {

	var OptionsRouter = Backbone.Router.extend({
		routes: {
			"": "getRequestHeaders",
			"request": "getRequestHeaders",
			"response": "getResponseHeaders",
			"about": "getAbout"
		},

		initialize: function() {
			this.requestView = new HeadersView({ el: $("#options-request") }, { headers: new HeaderSDK.Collections.Request });
			this.responseView = new HeadersView({ el: $("#options-response") }, { headers: new HeaderSDK.Collections.Response });
			this.aboutView = new AboutView({ el: $("#options-about") });
			
			Backbone.history.start({ pushState: false });
		},
		execute: function(callback, args) {
			this.view && this.view.remove();
			callback && callback.apply(this, args);
		},

		getRequestHeaders: function() {
			this.view = this.requestView;
			this.view.render();
		},
		getResponseHeaders: function() {
			this.view = this.responseView;
			this.view.render();
		},
		getAbout: function() {
			this.view = this.aboutView;
			this.view.render();
		}
	});

	var HeadersView = Backbone.View.extend({
		events: {
			"click .options-headers-create-add": "createHeader",
			"click .clear-all-headers": "removeAll"
		},
		
		initialize: function(attributes, options) {
			
			this.headers = options.headers;
			this.headers.fetch();

			// this.$createDescription = this.$el.find(".options-headers-create-description");
			// this.$createHeader = this.$el.find(".options-headers-create-header");
			// this.$createValue = this.$el.find(".options-headers-create-value");
			// this.$createActive = this.$el.find(".options-headers-create-active");

			this.$createDescription = this.$el.find(".options-headers-create-description");
			this.$addedHeadersJson = this.$el.find(".options-headers-create-json");
			this.$createActive = this.$el.find(".options-headers-create-active");

			this.listenTo(this.headers, "add", this.renderSingle);
		},
		render: function() {
			this.renderAll();
			this.$el.show();
		},
		remove: function(header) {
			this.$el.find("tbody").find(".options-headers-row").remove();
			this.$el.hide();
		},
		removeAll: function() {
			this.$el.find(".options-headers-row").remove();
			localStorage.clear()
		},

		renderSingle: function(header) {
			var view = new HeaderSDK.Views.Header({ model: header });
			this.$el.find("tbody").append(view.render().el);	
		},
		renderAll: function() {
			this.headers.each(this.renderSingle, this);
		},

		createHeader: function() {
			// add some header fields
			var headersFields = JSON.parse(this.$addedHeadersJson.val())
			Object.keys(headersFields).forEach(key => {
				this.headers.create({
					description: this.$createDescription.val(),
					header: key,
					value: headersFields[key],
					active: this.$createActive.is(":checked")
				});
			});

			// clear edit input
			this.$createDescription.val("");
			this.$addedHeadersJson.val("");
			this.$createActive.prop("checked", true);

			// add a header field
			// this.headers.create({
			// 	description: this.$createDescription.val(),
			// 	header: this.$createHeader.val(),
			// 	value: this.$createValue.val(),
			// 	active: this.$createActive.is(":checked")
			// });

			// clear edit input
			// this.$createDescription.val("");
			// this.$createHeader.val("");
			// this.$createValue.val("");
			// this.$createActive.prop("checked", true);
		}
	});

	var AboutView = Backbone.View.extend({
		initialize: function() {
		
		},
		render: function() {
			this.$el.show();
		},
		remove: function() {
			this.$el.hide();
		}
	});
	
	$(function() {
		// Start the application
		var router = new OptionsRouter();
	});
})(jQuery);

