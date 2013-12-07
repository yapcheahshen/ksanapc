define(['../jslib/rangy/rangy-core'],function() {
  return {
  initialize: function(app) {
    app.sandbox.rangy=window.rangy;
  },
  afterAppStart: function() {
  	
  }
  };
});