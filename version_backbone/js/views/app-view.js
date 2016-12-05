var app = app || {};

(function($){
	'use strict';

	app.AppView = Backbone.View.extend({
		el: '.todoapp',
		statsTemplate: _.template($('#stats-template').html()),
		events: {
			'keypress .new-todo': 'createOnEnter',
			'click .clear-completed': 'clearCompleted',
			'click .toggle-all': 'toggleAllComplete'
		},
		initialize: function(){
			var t = this;
			t.allCheckbox = t.$('.toggle-all')[0];
			t.$input = t.$('.new-todo');
			t.$footer = this.$('.footer');
			t.$main = this.$('.main');
			t.$list = $('.todo-list');

			t.listenTo(app.todos,'add',t.addOne);
			t.listenTo(app.todos,'reset',t.addAll);
			t.listenTo(app.todos,'change:completed',t.filterOne);
			t.listenTo(app.todos,'filter',t.filterAll);
			t.listenTo(app.todos,'all',_.debounce(t.render,0));

			app.todos.fetch({reset: true});
		},

		render: function(){
			var completed = app.todos.completed().length;
			var remaining = app.todos.remaining().length;

			if(app.todos.length){
				this.$main.show();
				this.$footer.show();

				this.$footer.html(this.statsTemplate({
					completed: completed,
					remaining: remaining,
				}));

				this.$('.filters li a')
					.removeClass('selected')
					.filter('[href="#/' + (app.TodoFilter || '') + '"]')
					.addClass('selected');
			}else{
				this.$main.hide();
				this.$footer.hide();
			};

			this.allCheckbox.checked = !remaining
		},

		addOne: function(todo){
			var view = new app.TodoView({model: todo});
			this.$list.append(view.render().el);
		},

		addAll: function(){
			this.$list.html('');
			app.todos.each(this.addOne,this);
		},

		filterOne: function(todo){
			todo.trigger('visible');
		},

		filterAll: function(){
			app.todos.each(this.filterOne,this)
		},

		newAttributes: function(){
			return {
				title: this.$input.val().trim(),
				order: app.todos.nextOrder(),
				completed: false
			};
		},

		createOnEnter: function(e){
			if(e.which === ENTER_KEY && this.$input.val().trim()){
				app.todos.create(this.newAttributes());
				this.$input.val('');
			}
		},

		clearCompleted: function () {
			_.invoke(app.todos.completed(), 'destroy');
			return false;
		},

		toggleAllComplete: function(){
			var completed = this.allCheckbox.checked;
			app.todos.each(function(todo){
				todo.save({
					completed: completed
				})
			})
		}
	})

})($)