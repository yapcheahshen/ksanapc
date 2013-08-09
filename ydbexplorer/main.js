/*!
	entry point for require.js
*/

requirejs.config( {  //require is used as node's require
      paths: {
		underscore: '../node_webkit/jslib/underscore',
		backbone: '../node_webkit/jslib/backbone',
		jquery: '../node_webkit/jslib/jquery',
		requirelib:'../node_webkit/jslib/require',
		text:'../node_webkit/jslib/requiretext',

		 aura:'../node_webkit/jslib/aura/aura',
		base:'../node_webkit/jslib/aura/base',
		platform:'../node_webkit/jslib/aura/platform',
		extensions:'../node_webkit/jslib/aura/extensions',
		logger:'../node_webkit/jslib/aura/logger',
		widgets:'../node_webkit/jslib/aura/ext/widgets',
		mediator:'../node_webkit/jslib/aura/ext/mediator',
		debug:'../node_webkit/jslib/aura/ext/debug', 
		eventemitter:'../node_webkit/jslib/eventemitter2', 
      }
});


requirejs(['jquery','underscore','backbone','requirelib','text',
	'aura','debug','mediator','widgets','eventemitter'
],function($,_,Backbone) {
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
	define([index],function(entry) {
			console.log('main module loaded',index);
    			if (entry && entry.initialize) entry.initialize();
  });
});