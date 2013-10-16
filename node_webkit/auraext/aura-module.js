define(['../jslib/base64'],function(Base64){
return {
  initialize: function(app) {
  	
  	app.sandbox.Base64=Base64;
	app.sandbox.minversion=function(mod, ver) {
		var m=app.sandbox[mod].version.match(/(\d*?)\.(\d*?)\.(\d*)/);
		console.log('module version',mod,m)
		var v=ver.match(/(\d*?)\.(\d*?)\.(\d*)/);
		if (!m) return false;
		var oldversion=parseInt(v[1])*65536+parseInt(v[2])*256+parseInt(v[3]);
		var newversion=parseInt(m[1])*65536+parseInt(m[2])*256+parseInt(m[3]);
		return newversion>oldversion;
	}
  },
  afterAppStart: function() {
  }
  
}});