(function($){
	'use strict';
	
	var ENTER_KEY = 13;
	
	var ESCAPE_KEY = 27;

	var TODO_TMP =  [
		'<li class='@(ifCompleted)' data-id="@(id)">',
		'				<div class="view">',
		'					<input class="toggle" type="checkbox" @(ifChecked)>',
		'					<label>@(title)</label>',
		'					<button class="destroy"></button>',
		'				</div>',
		'				<input class="edit" value="@(title)">',
		'			</li>'
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
		'			</ul>'
		'@(ifCompletedTodos)'
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
			if(argumnets.length > 1){
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
			this.todos = util.store('todos-jquery');
			this.todoTemplate = TODO_TMP;
			this.footerTemplate = FOOTER_TMP;
			this.bindEvent();

			new Router

		}
	}



})($)