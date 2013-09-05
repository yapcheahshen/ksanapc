define(function() {
  return function(app) {
    var _ = app.core.util._;
    var historyStarted = false;
    var Backbone;
    return {
      require: {
        paths: { 
          backbone: 'components/backbone/backbone',
          underscore: 'components/underscore/underscore' 
        },
        shim: {
          backbone: { exports: 'Backbone', deps: ['underscore', 'jquery'] }
        }
      },
      initialize: function(app) {
        Backbone = requirejs('backbone');
        app.core.mvc    = Backbone;
        app.sandbox.mvc = Backbone;
        //app.core.registerWidgetType('Backbone', Backbone.View.prototype);
        //app.core.registerWidgetType('Backbone.Epoxy', Backbone.Epoxy.View.prototype);
        app.components.addType('Backbone', Backbone.View.prototype);
        app.components.addType('Backbone.Epoxy', Backbone.Epoxy.View.prototype);
      },
      afterAppStart: function(app) {
      	  
        if (!historyStarted) {
          _.delay(function() {
            Backbone.history.start();  
            
          }, 200);
        }
      }
    }
  }
});