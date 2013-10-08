define(['../jslib/cjk/radicalvariants','../jslib/cjk/strokecount',
	'../jslib/cjk/cjkutil','../jslib/cjk/pinyin',],
	function(radicalvariants,strokecount,cjkutil,pinyin,glyphemesearch){

return {

  initialize: function(app) {
  		requirejs(['../node_webkit/jslib/ux/flattoc'],function(flattoc){
  			app.sandbox.flattoc=flattoc;	
  		});
  },
  afterAppStart: function() {
  }
  
}});