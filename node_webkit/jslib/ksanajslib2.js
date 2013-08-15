/*!
	fossil repository: http://www.ksana.tw/cgi-bin/ksanadb.cgi
*/

if(typeof String.prototype.trim !== 'function') { //IE sucks 
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  }
}

requirejs.config( {
      paths: {
	//	underscore: './underscore',
	//	backbone: './backbone',
		jquery: './jquery',
		requirelib:'./require',
		text:'./requiretext',
	       bootstrap:'./bootstrap',
		angular:'./angular',
		socketio:'../launcher/socket.io',
	//	howler:'./howler',

      }
});


requirejs(['jquery','underscore','backbone','requirelib','bootstrap','socketio'
,'text','angular'
],function() {
	Backbone.$=$; // add this line , otherwise backbone.js is not working occasionally 2013/8/7
	 		// this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);
	var href=window.location.href;
	var hash=href.lastIndexOf('#');
	if (hash>0) href=href.substring(0,hash);
	
	var i=href.lastIndexOf('/');
	
	var index=href.substr(i+1);
	index=index.replace('.html','');
	index=index.replace('.htm','');
	
	
	index=index.trim();
	if (!index) index='index'; // when user didn't type index.html
	console.log('trying to load module:'+index);
	//
	requirejs([index],function(entry) {
			console.log('main module loaded',index);
    			if (entry && entry.initialize) entry.initialize();
  });
});