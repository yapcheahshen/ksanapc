define(['../cli-js/rpc'],
function(host) {
	var makeinf=function(name) {
		return (
			function(opts,callback) {
				host.exec(callback,0,"yadb",name,opts);
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
	exports.getRaw=makeinf("getRaw");
	exports.closeAll=makeinf("closeAll");
	//exports.writeFile=writeFile;
	exports.initialize=makeinf("initialize");
	//exports.version='0.0.13'; //this is a quick hack
	host.exec(function(err,data){
		console.log('version',err,data)
		exports.version=data;
	},0,"yadb","version",{});


	return exports;
});