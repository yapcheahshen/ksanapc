define({
  initialize: function(app) {
	app.sandbox.minversion=function(mod, ver) {
		var m=app.sandbox[mod].version.match(/(\d*?)\.(\d*?)\.(\d*)/);
		var v=ver.match(/(\d*?)\.(\d*?)\.(\d*)/);
		if (!m) return false;
		return  (m[1]>=v[1] && m[2]>=v[2] && m[3]>=v[3]);
	}
  },
  afterAppStart: function() {
  }
});