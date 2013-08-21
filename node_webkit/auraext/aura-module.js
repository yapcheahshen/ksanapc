define({
  initialize: function(app) {
	app.sandbox.minversion=function(mod, ver) {
		var m=app.sandbox[mod].version.match(/(\d*?)\.(\d*?)\.(\d*)/);
		console.log('module version',mod,m)
		var v=ver.match(/(\d*?)\.(\d*?)\.(\d*)/);
		if (!m) return false;
		return  (parseInt(m[1])>=parseInt(v[1]) && parseInt(m[2])>=parseInt(v[2]) && parseInt(m[3])>=parseInt(v[3]));
	}
  },
  afterAppStart: function() {
  }
});