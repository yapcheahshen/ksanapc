define(['../cli-js/rpc'],
function(host) {
	var makeinf=function(name) {
		return (
			function(opts,callback) {
				host.exec(callback,0,"refinery",name,opts);
			});
	}
	/*
	var writeFile=function(fn,data,callback) {
		host.exec(callback,0,"yadb","writeFile",{filename:fn,data:data});
	}
	*/
	
	var exports={};
	//TODO , create a cache object on client side to save network trafic on
	//same getRaw
	exports.save=makeinf("save");
	exports.load=makeinf("load");
	exports.initialize=makeinf("initialize");
	host.exec(function(err,data){
		console.log('version',err,data)
		exports.version=data;
	},0,"refinery","version",{});

	return exports;
});