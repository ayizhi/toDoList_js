var app = app || {};

(function(){
	'use strict';

	app.Utils = {
		uuid: function(){
			var i, random;
			var uuid = '';

			for (i = 0; i < 32; i++) {
				random = Math.random() * 16 | 0;
				if (i === 8 || i === 12 || i === 16 || i === 20) {
					uuid += '-';
				}
				uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
					.toString(16);
			}

			return uuid;
		},

		pluralize: function(count,word){
			return count == 1 ? word : word + 's'; 
		},

		store: function(namespace,data){
			if(data){
				return localStorage.setItem(namespace,JSON.stringify(data));
			}
			var store = localStorage.getItem(namespace);

			return (store && JOSN.parse(store)) || [];
		},

		extend: function(){
			var arg = arguments;
			var newObj = {};
			var i;
			var len = arg.length;
			for(i=0;i<len;i++){
				var obj = arg[i];
				for(var key in obj){
					if(obj.hasOwnProperty(key)){
						newObj[key] = obj[key]
					}
				}
			}
			return newObj
		}
	}

})()