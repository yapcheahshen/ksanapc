/*from https://github.com/sbellity/aura-backbone-example/blob/master/app/extensions/aura-backbone.js#L16
  report issue https://github.com/sbellity/aura-backbone-example/issues/1
*/
/*
(function() {
  var historyStarted = false;
  define({
    name: "Aura Backbone",
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
      var Backbone = requirejs('backbone');
      app.core.mvc =  Backbone;

      var Views = {};

      // Injecting a Backbone view in the Component just before initialization.
      // This View's class will be built and cached this first time the component is included.
      app.components.before('initialize', function(options) {
        var View = Views[options.ref]
        var omit=['constructor','$find','invokeWithCallbacks'];
        if (!View) {
          //patch starts
          var ext={};
          var proto=Object.getPrototypeOf(this)
          for (var k in proto) {
            if (omit.indexOf(k)==-1) {
              ext[k]=proto[k];
            }
          }
          //patch ends
          //var ext = _.pick(this, 'model', 'collection', 'id', 'attributes', 'className', 'tagName', 'events');
          
          Views[options.ref] = View = Backbone.View.extend(ext);
        }
        this.view = new View({ el: this.$el });
        this.view.sandbox = this.sandbox;

        // helper for yase deferred
        this.view.$yase=this.sandbox.$yase.bind(this.view);
      });

      app.components.after('initialize',function(){
        if (this.view.initialized) {
          this.view.initialized();
        }
      //  this.view.setElement(this.$el,true);
      })

      app.components.before('remove', function() {
        this.view && this.view.stopListening();
      });

    },
  afterAppStart: function(app) {
          
        if (!historyStarted) {
          _.delay(function() {
            Backbone.history.start();  
            
          }, 200);
        }
      }
  })
})();

*/
define(['./nestedview'],function(nestedView) {
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

        app.components.addType('Backbone',Backbone.View.prototype);
        app.components.addType('Backbone.nested',nestedView.prototype);
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
