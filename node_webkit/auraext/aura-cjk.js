define(['../jslib/cjk/radicalvariants','../jslib/cjk/strokecount',
	'../jslib/cjk/cjkutil','../jslib/cjk/pinyin',],
	function(radicalvariants,strokecount,cjkutil,pinyin,glyphemesearch){

return {

  initialize: function(app) {
  		requirejs(['../node_webkit/jslib/cjk/glyphemesearch'],function(glyphemesearch){
  			app.sandbox.glyphemesearch=glyphemesearch;	
  		});
  		requirejs(['../node_webkit/jslib/cjk/dgg'],function(dgg){
  			app.sandbox.dgg=dgg;	
  		});    		
  		app.sandbox.radicalvariants=radicalvariants;
  		app.sandbox.strokecount=strokecount;
  		app.sandbox.cjkutil=cjkutil;
  		app.sandbox.pinyin=pinyin;
  },
  afterAppStart: function() {
  }
  
}});