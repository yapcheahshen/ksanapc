define(function() {
  return {
 initialize: function(app) {
   var makeinf=function(name) {
      return function(opts,callback) {
          app.sandbox.services["refinery"][name](opts,callback);
      }
   }  
     if (typeof process !='undefined' &&process.versions['node-webkit']) {
        /* compatible async interface for browser side js code*/
        var api_refinery=require('refinery').api ; 
        if (!app.sandbox.services) app.sandbox.services={};
        api_refinery(app.sandbox.services); //install api into services
        app.sandbox.refinery={ //turn into async, for compatible with node_server
            save: makeinf('save'),
            load: makeinf('load'),
            version: app.sandbox.services["refinery"].version()
        };  
     } else {
        //for node_server , use socket.io to talk to server-side yadb_api.js
        requirejs(['../node_server/cli-js/rpc_refinery'],function(refinery){
          app.sandbox.refinery=refinery;
        });
     }
  },
  afterAppStart: function() {
  }
}});