define(['../jslib/diff'],function(diff) {
  return {
  initialize: function(app) {
    app.sandbox.diff=diff;
  },
  afterAppStart: function() {
  	
  }
  };
});