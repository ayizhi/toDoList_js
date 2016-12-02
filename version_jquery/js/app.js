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
		'					<a class="@(all_selected)" data-filter="all">All</a>',
		'				</li>',
		'				<li>',
		'					<a class="@(active_selected)" data-filter="active">Active</a>',
		'				</li>',
		'				<li>',
		'					<a class="@(completed_selected)" data-filter="completed">Completed</a>',
		'				</li>',
		'			</ul>',
		'@(ifCompletedTodos)',
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
			return count === 1 ? word : word + 's';
		},

		store: function(namespace,data){
			if(arguments.length > 1){
				return localStorage.setItem(namespace,JSON.stringify(data));
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
			t.todoTmp = TODO_TMP;
			t.footerTmp = FOOTER_TMP;
			t.bindEvent();
			t.render();
		},

		bindEvent: function(){
			var t = this;
			$('#new-todo').on('keyup',t.create.bind(t));
			$('#toggle-all').on('change',t.toggleAll.bind(t));
			$('#footer').on('click','#clear-completed',t.destroyCompleted.bind(t));
			$('#footer').on('click','#filters li',t.chooseFilter.bind(t));
			$('#todo-list')
				.on('change','.toggle',t.toggle.bind(t))
				.on('dblclick','label',t.edit.bind(t))
				.on('keyup','.edit',t.editKeyup.bind(t))
				.on('focusout','.edit',t.update.bind(t))
				.on('click','.destroy',t.destroy.bind(t))
		},

		render: function(){
			var t = this;
			var todos = t.getFilteredTodos();
			var theHtml = ''
			for(var i = 0 , len = todos.length ; i < len ; i++){
				var todo = todos[i];
				theHtml += util.formString(t.todoTmp,$.extend(todo,{
					ifCompleted: todo.completed ? 'completed' : '',
					ifChecked: todo.completed ? 'checked':'',
				}));
			} 

			$('#todo-list').html(theHtml);//不用模板引擎的缺点在于需要单写逻辑
			$('#main').toggle(todos.length > 0);
			$('#toggle-all').prop('checked',t.getActiveTodos().length === 0);
			
			t.renderFooter();

			$('#new-todo').focus();
			util.store('todos-jquery',this.todos);
		},

		renderFooter: function(){
			var t = this;
			var todoCount = t.todos.length;
			var activeTodoCount = t.getActiveTodos.length;
			var completedTodos = todoCount - activeTodoCount;
			var theHtml = util.formString(t.footerTmp,{
				activeTodoCount: activeTodoCount,
				activeTodoWord: util.pluralize(activeTodoCount,'item'),
				ifCompletedTodos: completedTodos ? '<button id="clear-completed">Clear completed</button>' : '',
				all_selected: t.filter == 'all' ? 'selected' : '',
				active_selected: t.filter == 'active' ? 'selected' : '',
				completed_selected: t.filter == 'completed' ? 'selected' : ''
			});

			$('#footer').toggle(todoCount > 0).html(theHtml);
		},

		toggleAll: function(e){
			var t = this;
			var isChecked = $(e.target).prop('checked');
			t.todos.forEach(function(todo){
				todo.completed = isChecked;
			});

			t.render();
		},

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
		},

		destroyCompleted: function(){
			var t = this;
			t.todos = t.getActiveTodos();
			this.filter = 'all',
			this.render();
		},

		chooseFilter:function(e){
			var t = this;
			var $el = $(e.target);
			var $a = $el.get(0).tagName.toString().toLowerCase() == 'a' ? $el:$el.find('a');
			var filter = $a.attr('data-filter');
			t.filter = filter;
			t.render()
		},

		indexFromEl: function(el){
			var id = $(el).closest('li').data('id');
			var todos = this.todos;
			var i = todos.length;
			while(i--){
				if(todos[i].id === id){
					return i;
				}
			}
		},

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

			t.render();
		},

		toggle: function(e){
			var  i = this.indexFromEl(e.target);
			this.todos[i].completed = !this.todos[i].completed;
			this.render();
		},

		edit: function(e){
			var $input = $(e.target).closest('li').addClass('editing').find('.edit');
			$input.val($input.val()).focus();
		},

		editKeyup: function(e){
			if(e.which === ENTER_KEY){
				e.target.blur();
			}

			if(e.which === ESCAPE_KEY){
				$(e.target).data('abort',true).blur();
			}
		},

		update: function(e){
			var t = this;
			var el = e.target;
			var $el = $(el);
			var val = $el.val().trim();

			if(!val){
				t.destroy(e);
				return;
			}

			if($el.data('abort')){
				$el.data('abort',false);
			}else{
				t.todos[t.indexFromEl(el).title = val];
			}

			t.render();
		},

		destroy: function(e){
			var t = this;
			t.todos.splice(t.indexFromEl(e.target),1);
			this.render();
		}
	};

	App.init()



})($)