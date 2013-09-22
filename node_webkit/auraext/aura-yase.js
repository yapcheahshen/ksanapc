/*
  aura-ydb interface for node-webkit and node server.
  bridge node context and DOM context only in aura-extensions
  do not call node function directly in widgets js
*/
define(function() {
  return {
 
 initialize: function(app) {
    var makeinf=function(name) {
      return function(opts,callback) {
              var data=app.sandbox.services["yase"][name](opts);
              //this line is not really needed.
              setTimeout( function() { callback(0,data) }, 0);        
      }
   }
     if (typeof process !='undefined' &&process.versions['node-webkit']) {
        /* compatible async interface for browser side js code*/
        var api_yase=require('yase').api ; 
        if (!app.sandbox.services) app.sandbox.services={};
        api_yase(app.sandbox.services); //install api into services
        app.sandbox.yase={ //turn into async, for compatible with node_server
            phraseSearch: makeinf('phraseSearch'),
            getText: makeinf('getText'),
            getTextByTag: makeinf('getTextByTag'),
            getTagInRange: makeinf('getTagInRange'),
            closestTag: makeinf('closestTag'),
            buildToc: makeinf('buildToc'),
            getTagAttr: makeinf('getTagAttr'),
            fillText: makeinf('fillText'),
            getRange: makeinf('getRange'),
            getRaw: makeinf('getRaw'),
            getBlob: makeinf('getBlob'),
            findTag: makeinf('findTag'),
            customfunc: makeinf('customfunc'),
            version: app.sandbox.services["yase"].version()
        };  
     } else {
        //for node_server , use socket.io to talk to server-side yase_api.js
        requirejs(['../node_server/cli-js/rpc_yase'],function(yase){
          app.sandbox.yase=yase;
        });
     }
  },
  afterAppStart: function() {
  }
}});