define(['../ksanadb/rpc'],
function(host) {
	var makeinf=function(name) {
		return (
			function(opts,callback) {
				host.exec(callback,0,"yadm",name,opts);
			});
	}
	
	var exports={};
	
	exports.initialize=makeinf("initialize");
	exports.phraseSearch=makeinf("phraseSearch");
//	exports.gettext=makeinf("gettext");
//	exports.getpage=makeinf("getpage");
//	exports.getrange=makeinf("getrange");
//	exports.fuzzysearch=makeinf("fuzzysearch");
	

	return exports;
});