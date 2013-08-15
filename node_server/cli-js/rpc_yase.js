define(['../cli-js/rpc'],
function(host) {
	var makeinf=function(name) {
		return (
			function(opts,callback) {
				host.exec(callback,0,"yase",name,opts);
			});
	}
	
	var exports={};
	
	exports.initialize=makeinf("initialize");
	exports.phraseSearch=makeinf("phraseSearch");
	exports.getText=makeinf("getText");
	exports.fillText=makeinf("fillText");
	exports.getRange=makeinf("getRange");
//	exports.getpage=makeinf("getpage");
//	exports.fuzzysearch=makeinf("fuzzysearch");
	

	return exports;
});