define(['underscore','backbone','aura'], function(_,Backbone,Aura) {
 console.log('loading index.js')
  var app=Aura({debug: { enable: true}});
  app.components.addSource('aura', '../node_webkit/auraext');
  app.components.addSource('kse', '../kse/aura_components');

    app.use('../node_webkit/auraext/aura-backbone')
    .use('../node_webkit/auraext/aura-yadb')
    .use('../node_webkit/auraext/aura-yase')
    .use('../node_webkit/auraext/aura-rangy')
    .start({ widgets: 'body' }).then(function() {
    	console.log('Aura Started');
    })
});