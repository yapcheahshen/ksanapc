/*
  aura-ydb interface for node-webkit.
  this file serve like the role of socket.io client side rpc interface
*/
define(function() {
  return {
 
 initialize: function(app) {
     if (typeof process !='undefined' &&process.versions['node-webkit']) {
        var api_yadb=require('yadb').api ; 
        if (!app.sandbox.services) app.sandbox.services={};
        api_yadb(app.sandbox.services);
          app.sandbox.yadb={ //turn into async, for compatible with socket.io
            getRaw: function( path, callback) {
              var data=app.sandbox.services["yadb"].getRaw(path);
            setTimeout( function() { callback(0,data) }, 0);
          }
        };  
     } else {
        requirejs(['../node_server/cli-js/rpc_yadb'],function(yadb){
          app.sandbox.yadb=yadb;
        });
     }
  },
  afterAppStart: function() {
  }
}});