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
             //callback(0,data);
      }
   }
     if (typeof process !='undefined' &&process.versions['node-webkit']) {
        /* compatible async interface for browser side js code*/
        var api_yase=require('yase').api ; 
        if (!app.sandbox.services) app.sandbox.services={};
        api_yase(app.sandbox.services); //install api into services
        app.sandbox.yase={ //turn into async, for compatible with node_server
            phraseSearch: makeinf('phraseSearch'),
            boolSearch: makeinf('boolSearch'),
            search: makeinf('search'),
            getTermVariants: makeinf('getTermVariants'),
            getText: makeinf('getText'),
            getTextByTag: makeinf('getTextByTag'),
            getTextRange:makeinf('getTextRange'),
            getTagInRange: makeinf('getTagInRange'),
            closestTag: makeinf('closestTag'),
            buildToc: makeinf('buildToc'),
            getTagAttr: makeinf('getTagAttr'),
            fillText: makeinf('fillText'),
            getRange: makeinf('getRange'),
            getRaw: makeinf('getRaw'),
            getBlob: makeinf('getBlob'),
            findTag: makeinf('findTag'),
            expandToken: makeinf('expandToken'),
            
            findTagBySelectors: makeinf('findTagBySelectors'),
            exist: makeinf('exist'),
            keyExists: makeinf('keyExists'),
            customfunc: makeinf('customfunc'),
            version: app.sandbox.services["yase"].version(),

            enumLocalYdb:makeinf('enumLocalYdb'),
            sameId:makeinf('sameId'),
        };  
     } else {
        //for node_server , use socket.io to talk to server-side yase_api.js
        requirejs(['../node_server/cli-js/rpc_yase'],function(yase){
          app.sandbox.yase=yase;
        });
     }

      app.sandbox.$yase=function(api,opts) {
        if (typeof app.sandbox.yase[api]!=='function') {
          throw api+' not found';
          return;
        }
        var deferred = new $.Deferred();
        var promise=deferred.promise();
        var that=this;

        app.sandbox.yase[api](opts,function(err,data){
          if (err) deferred.fail(err);
          else deferred.resolveWith(that,[data]);
          deferred.always(err);
        });

        return promise;
      }
  },
  afterAppStart: function() {
  }
}});