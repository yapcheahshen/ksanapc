define(['../jslib/rangy/rangy-core'],function(rangy) {
  return {
  initialize: function(app) {
    app.sandbox.rangy=rangy;
  },
  afterAppStart: function() {
  	
  }
  };
});