define(['underscore','backbone','aura'], function(_,Backbone,Aura) {
  var app=Aura({debug: { enable: true}});
  app.registerWidgetsSource('aura', '../node_webkit/auraext');
    app.use('../node_webkit/auraext/aura-backbone')
    .use('../node_webkit/auraext/aura-yadb-nw')
//    .use('../auraext/aura-dirty')
//    .use('../auraext/aura-session')
    .start({ widgets: 'body' }).then(function() {
    	console.log('Aura Started')
    })

});