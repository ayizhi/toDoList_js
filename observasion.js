var pubsub = {};//包含三个方法：订阅，退订，发布
(function(p){
	var topics = {},//回调函数存放的数组
	subUid = -1;

	//发布方法
	p.publish = function(topic,args){
		if(!topics[topic]){
			return false;
		}
		console.log(topics,'==')

		setTimeout(function(){
			var subscribers = topics[topic];
			var len = subscribers ? subscribers.length : 0;
			
			while(len--){
				subscribers[len].func(topic,args)
			}
		},0);

		return true;
	}

	//订阅方法
	p.subscribe = function(topic,func){
		if(!topics[topic]){
			topics[topic] = [];
		}

		var token = (++subUid).toString();
		topics[topic].push({
			token: token,
			func: func
		})
		console.log(topics,token)
		return token
	}

	//退订
	p.unsubscribe = function(token){
		for(var m in topics){
			if(topics[m]){
				for(var i = 0 ;i<topics[m].length;i++){
					if(topics[m][i].token === token){
						topics[m].splice(i,1);
						return token;
					}
				}
			}
		}
		return false
	} 
})(pubsub)


//来，订阅一个
pubsub.subscribe('example1', function (topics, data) {
    console.log(topics + ": " + data);
});

//发布通知pubsub.publish('example1', 'hello world!');
pubsub.publish('example1', ['test', 'a', 'b', 'c']);
pubsub.publish('example1', [{ 'color': 'blue' }, { 'text': 'hello'}]);