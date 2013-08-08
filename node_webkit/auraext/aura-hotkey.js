define(['underscore','backbone'],function(_,Backbone) {
  return {
  initialize: function(app) {
	var eventObject = {};
	_.extend(eventObject, Backbone.Events);
	app.sandbox.onSystemHotKey=function( event, handler, context) {
		console.log('on hotkey')
		eventObject.on(event,handler,context);
	}
	
	app.sandbox.setSystemHotKey=function (codes) {
		console.log('set hotkey')
		document.addEventListener && // Modern browsers only
		document.addEventListener("keydown", function (e) {
			var code = codes[e.keyCode];
			if (e.ctrlKey || e.metaKey && code) {
				if(code) eventObject.trigger(code);
			}
		}, false);
	};
  },
  afterAppStart: function() {
   	
  }
}
 });