define(function() {

  return {
 
 initialize: function(app) {

 	var api_yadb=require('yadb').api ; 
 	if (!app.sandbox.services) app.sandbox.services={};
 	api_yadb(app.sandbox.services);
  	app.sandbox.yadb={
  		getRaw: function( path, callback) {
  			var data=app.sandbox.services["yadb"].getRaw(path);
			setTimeout( function() { callback(0,data) }, 0);
		}
	};
  },
  afterAppStart: function() {
  }
}});