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
		jquery: './jquery',
		underscore: './underscore',
		backbone: './backbone',
		backbone_epoxy: './backbone.epoxy',
		requirelib:'./require',
		text:'./requiretext',
	    bootstrap:'./bootstrap',
	    bootbox:'./bootbox',
		eventemitter:'./eventemitter2',
		
		aura:'./aura/aura',
		base:'./aura/base',
		platform:'./aura/platform',
		"aura.extensions":'./aura/aura.extensions',
		auraextensions:'./aura/aura.extensions',

		logger:'./aura/logger',
		components:'./aura/ext/components',
		mediator:'./aura/ext/mediator',
		debug:'./aura/ext/debug', 
		socketio:'./socket.io',
		cjkutil:'./cjk/cjkutil',
		strokecount:'./cjk/strokecount',
		glyphemesearch:'./cjk/glyphemesearch',
		radicalvariants:'./cjk/radicalvariants',
		pinyin:'./cjk/pinyin',
		rangy:'./rangy/rangy-core'
	//	howler:'./howler',

      }
});


requirejs(['jquery','underscore','backbone','requirelib','socketio'
,'text','eventemitter','backbone_epoxy','pinyin'
,'aura','debug','mediator','components','glyphemesearch','rangy'
],function() {
	window.jQuery=$;
	requirejs(['bootstrap','bootbox']);
	Backbone.$=$; // add this line , otherwise backbone.js is not working occasionally 2013/8/7
	 		// this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);
	var href=window.location.href;
	var hash=href.lastIndexOf('#');
	if (hash>0) href=href.substring(0,hash);
	
	var i=href.lastIndexOf('/');
	requirejs.config({baseUrl: href.substring(0,i)})
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