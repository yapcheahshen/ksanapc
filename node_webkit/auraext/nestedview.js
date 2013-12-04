
/* backbone nested view extension 
inspired from 
http://blog.shinetech.com/2012/10/10/efficient-stateful-views-with-backbone-js-part-1/
http://bardevblog.wordpress.com/2012/12/13/re-learning-backbone-js-nested-views
http://stackoverflow.com/questions/9337927/how-to-handle-initializing-and-rendering-subviews-in-backbone-js
http://www.sophomoredev.com/2012/06/a-different-approach-to-rendering-backbone-sub-views/
*/
define(['backbone'],function(Backbone){
	var nestedView=Backbone.View.extend({
      $yase: function(){ //promise interface
            return this.sandbox.$yase.apply(this,arguments)
      },
      commands:{},
      runcommand:function() {
            var func=this.commands[arguments[0]];
            var remain=Array.prototype.slice.apply(arguments,[1]);
            if (typeof func==="string") {
                  var f=this[func];
                  if (f) func=f;
                  else {
                        console.error('function '+func+' not found');
                        return;
                  }
            }
            var that=this;
            if (func) setTimeout(function(){return func.apply(that,remain)},1);
            //if (func) func.apply(this,remain);            
      },
      sendChildrenByArray:function(command,params) {
            for (var i=0;i<this.sandbox._children.length;i++) {
                  var C=this.sandbox._children[i]._component;
                  this.runcommand.apply(C,[command,params[i]]);
            }
            return this;            
      },
      sendChildren:function() {
      	for (var i in this.sandbox._children) {
      		var C=this.sandbox._children[i]._component;
                  this.runcommand.apply(C,arguments);
      	}
      	return this;
      },
      sendLastChild:function() {
            var children=this.sandbox._children;
            if (!children.length) return;
            var lastchild=children[children.length-1]._component;
            this.runcommand.apply(lastchild,arguments);
            return this;
      },
      sendParent:function() { //send to parent
            this.runcommand.apply(this.sandbox._parent._component,arguments);
            return this;
      },
      sendDescendant:function() { //send to all descendant
            for (var i in this.sandbox._children) {
                  var C=this.sandbox._children[i]._component;
                  this.runcommand.apply(C,arguments);
                  C.sendChildren.apply(C,arguments);
            }
            return this;            
      },
      toString:function(indent) {
            indent=indent||"";
            for (var i in this.sandbox._children) {
                  var C=this.sandbox._children[i]._component;
                  console.log(indent+" "+C.$el.data("aura-component"));
                  C.toString(indent+" ");
            }
      },
      onReady:function() {
            this.sandbox.logger.log(this.$el.data('aura-component'),'ready')
      },
      constructor:function() {
            Backbone.View.apply(this, arguments);
            if (this.$el.attr('data-aura-widget')) {
                  console.warn('please replace data-aura-widget with data-aura-component',this.$el.attr('data-aura-widget'))
            }
      }
    });
    return nestedView;
});