var app = app || {};

(function($){
	'use strict';

	app.AppView = Backbone.View.extend({
		el: '.todoapp',
		statsTemplate: _.template($('#state-template').html()),
		events: {
			'keypress .new-todo': 'createOnEnter',
			'click .clear-completed': 'clearCompleted',
			'click .toggle-all': 'toggleAllComplete'
		},
		initialize: function(){
			var t = this;
			t.allCheckbox = t.$('.toggle-all')[0];
			t.$input = t.$('.new-todo');
			t.$footer = t.$('.main');
			t.$list = $('.todo-list');

			t.listenTo(app.todos,'add',t.addOne);
			t.listenTo(app.todos,'reset',t.addAll);
			t.listenTo(app.todos,'change:completed',t.filterOne);
			t.listenTo(app.todos,'filter',t.filterAll);
			t.listenTo(app.todos,'all',_.debounce(this.render,0));

			app.todos.fetch({reset: true});
		},
	})

})($)