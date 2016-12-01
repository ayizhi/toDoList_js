(function($){
	'use strict';
	
	var ENTER_KEY = 13;
	
	var ESCAPE_KEY = 27;

	var TODO_TMP =  [
		'<li class="@(ifCompleted)" data-id="@(id)">',
		'	<div class="view">',
		'		<input class="toggle" type="checkbox" @(ifChecked)>',
		'		<label>@(title)</label>',
		'		<button class="destroy"></button>',
		'	</div>',
		'	<input class="edit" value="@(title)">',
		'</li>'
		].join("");

	var FOOTER_TMP = [
		'<span id="todo-count"><strong>@(activeTodoCount)</strong> @(activeTodoWord) left</span>',
		'			<ul id="filters">',
		'				<li>',
		'					<a class="@(all_selected)" href="#/all">All</a>',
		'				</li>',
		'				<li>',
		'					<a class="@(active_selected)" href="#/active">Active</a>',
		'				</li>',
		'				<li>',
		'					<a class="@(completed_selected)" href="#/completed">Completed</a>',
		'				</li>',
		'			</ul>',
		'@(ifCompletedTodos)',
		'<button id="clear-completed">Clear completed</button>'
		].join("");

	var util = {
		uuid: function(){
			var i,random;
			var uuid = '';
			for(i=0;i<32;i++){
				random = Math.random() * 16 | 0;
				if(i === 8 || i === 12 || i === 16 || i === 20){
					uuid += '-';
				}

				uuid += (i == 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
			}
			return uuid;
		},

		pluralize: function(count,word){
			return cound === 1 ? word : word + 's';
		},

		store: function(namespace,data){
			if(arguments.length > 1){
				return localStorage.setItem(namespace,JSON.stringfy(data));
			}else{
				var store = localStorage.getItem(namespace);
				return (store && JSON.parse(store)) || [];
			}
		},

		formString: function(str,data){
			return str.replace(/@\((\w+)\)/g,function(match,key){
				return typeof data[key] === 'undefined' ? '' : data[key]
			})
		}
	};

	var App = {
		init: function(){
			var t = this;
			t.todos = util.store('todos-jquery');
			t.todoTemplate = TODO_TMP;
			t.footerTemplate = FOOTER_TMP;
			t.bindEvent();
		},

		bindEvent: function(){
			var t = this;
			$('#new-todo').on('keyup',t.create.bind(t))
		},

		render: function(){
			var t = this;
			var todos = t.getFilteredTodos();
			var todoHtml = formString(t.todoTemplate,$.extend(todos,{
				ifCompleted: todos.completed ? 'completed' : '',
				ifChecked: todos.completed ? 'checked':'',
			}));
			$('todo-list').html(todoHtml);//不用模板引擎的缺点在于需要单写逻辑
			$('#main').toggle(todos.length > 0);
			$('#toggle-all').prop('checked',t.getActiveTodos().length === 0);
			t.renderFooter();
			$('#new-todo').focus();
			util.store('todos-jquery',this.todos);
		},

		renderFooter: function(){},

		getActiveTodos: function(){
			return this.todos.filter(function(todo){
				return !todo.completed
			})
		},

		getCompletedTodos: function(){
			return this.todos.filter(function(todo){
				return todo.completed
			})
		},

		getFilteredTodos: function(){
			if(this.filter === 'active'){
				return this.getActiveTodos();
			}

			if(this.filter === 'completed'){
				return this.getCompletedTodos();
			}

			return this.todos;
		}

		create: function(e){
			var t = this;
			var $input = $(e.target);
			var val = $input.val().trim();

			if(e.which !== ENTER_KEY || !val){
				return
			}

			t.todos.push({
				id: util.uuid(),
				title: val,
				completed: false
			})

			$input.val('');

			this.render();
		}


	}

	App.init()



})($)