define(['../jslib/refinery/aem'],
	function(aem){

return {

  initialize: function(app) {
  		app.sandbox.aem=aem;
  },
  afterAppStart: function() {
  }
  
}});