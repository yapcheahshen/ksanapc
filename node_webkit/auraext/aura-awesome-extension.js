define({
  initialize: function(app) {
	app.sandbox.yap={abc:1};
    console.log("My Awesome extension",app);
  },
  afterAppStart: function() {
    console.log("The App with my awesome extension started fine");
  }
});