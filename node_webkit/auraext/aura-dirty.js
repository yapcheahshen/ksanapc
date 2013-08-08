define(['../ksanadb/rpc_dirty'],function(dirty) {
  return {
  initialize: function(app) {
  	app.sandbox.dirty=dirty;
	app.sandbox.GUID=function () {
    		var S4 = function ()    {    return Math.floor(        Math.random() * 0x10000  ).toString(16);  };
    		return (   S4() + S4() + "-" + S4() + "-" +  S4() + "-" + S4() + "-" +S4() + S4() + S4()    );
  	}
  	
  	console.log('Dirty RPC started')
  },
  afterAppStart: function() {
  	
  }
  };
});