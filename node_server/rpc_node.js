/*
	simple node RPC based on socket io
	2012/9/6 yapcheahshen@gmail.com
	
	inspired by phonegap(cordova)
	new services are defined in services.js
	see api_hello.js for syncronize call, api_fs.js for asyncronize call
*/

var API={}; 
var RPCs={};      //call from client
var makecallback=function(fid) {
	return function(err,params) {
		var slot=RPCs[fid];
		slot.result.response=params;
		slot.result.err=err;
		slot.result.success=true;
		slot.client.emit('rpc', slot.result );
		delete RPCs[fid];
	}
}
var callfromclient =function(client,frombrowser) {
	
	this.default_handler=function(name) {
		return { "msg":'argu:'+JSON.stringify(name)+", ERROR!!server side api not found:"} ;
	}

	var handler=API[frombrowser.service] [frombrowser.action];
	var result={};
	
	handler=handler||this.default_handler;

	result.fid=frombrowser.fid;
	if (handler) {
		if (handler.async) {
			var slot={};
			slot.client=client;
			slot.result=result;
			RPCs[result.fid]=slot;
			var callback=makecallback(frombrowser.fid);
			result.response=handler(frombrowser.params,callback);
		} else { //syncronize system call
			result.response=handler(frombrowser.params);
			result.err=0;
			result.success=true;
			//console.log(result);
			client.emit('rpc', result );
		}
	}
	else result.success=false;
};

var finalize=function() {
	if (API['yadb']) API['yadb'].closeAll();
}

var rpc_init=function(server) {
	var io=require('socket.io').listen(server);

	io.set('log level',0);
	io.set('transports', ['htmlfile', 'xhr-polling','xhr-pooling']);
	io.on('connection', function(client){
		client.on('rpc', function(data){
			//('\nrpc from client',JSON.stringify(data));
			callfromclient(client, data);
		});
	});
};
		
var services=require('./services');
services(API); 
rpc_init.finalize=finalize;
module.exports=rpc_init;