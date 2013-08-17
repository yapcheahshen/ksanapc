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
	exports.getRaw=makeinf("getRaw");
	//exports.writeFile=writeFile;
	exports.initialize=makeinf("initialize");
	host.exec(function(err,data){
		exports.version=data;
	},0,"yadb","version");


	return exports;
});