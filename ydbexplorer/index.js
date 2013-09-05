define(['underscore','backbone','aura'], function(_,Backbone,Aura) {
 console.log('loading index.js')
  var app=Aura({debug: { enable: false}});
  app.components.addSource('aura', '../node_webkit/auraext');
    app.use('../node_webkit/auraext/aura-backbone')
    .use('../node_webkit/auraext/aura-yadb')
    .start({ widgets: 'body' }).then(function() {
    	console.log('Aura Started')
    })

});