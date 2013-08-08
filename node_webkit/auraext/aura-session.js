/*
	session support, reload if server is restarted
*/
define({
  	initialize: function(app) {
  		app.sandbox.yadm.initialize(null,function(err,sessionid) {
			app.sandbox.sessionid=sessionid;
			console.log("session id",sessionid);
		});
	}, 
	heartbeat :function(app) {
 		var sessionid=app.sandbox.sessionid;
		if (!sessionid) return;
		var opts={sessionid:sessionid};
		app.sandbox.yadm.heartbeat(opts,function(err,data) {
			if (data==-1) window.location.reload();
			app.sandbox.lastaccess=new Date();
		});
	},	  
	 afterAppStart: function(app) {
	 	var that=this;
	 	setInterval(function() {that.heartbeat(app)},2000);
	 	console.log('session started')
  	}
});