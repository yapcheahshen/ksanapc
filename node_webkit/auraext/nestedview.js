
/* backbone nested view extension 
inspired from 
http://blog.shinetech.com/2012/10/10/efficient-stateful-views-with-backbone-js-part-1/
http://bardevblog.wordpress.com/2012/12/13/re-learning-backbone-js-nested-views
http://stackoverflow.com/questions/9337927/how-to-handle-initializing-and-rendering-subviews-in-backbone-js
http://www.sophomoredev.com/2012/06/a-different-approach-to-rendering-backbone-sub-views/
*/
define(['jquery','underscore','backbone'],function($,_,Backbone){
	var nestedView=Backbone.View.extend({
      $yase: function(){ //promise interface
            return this.sandbox.$yase.apply(this,arguments)
      },
      initNested:function() { //maybe removed if aura provide a hook..
      	console.error('obsolute!!')
      },
      closeChildren:function() {
            for (var i in this._children) {
                  var C=this._children[i];
                  if (C.destroy) C.close(); else (C.remove());
            }
      },
      _addChildren:function(extras) { //automatic add all child view, call this after html()
      	var children=this.$("div[data-aura-component]");
      	this.closeChildren();
            this.children=[];
            var that=this;
            for (var i=0;i<children.length;i++) {
                  if (!children[i]) {
                        console.error('empty child');
                        continue;
                  }
                  var extra=(extras instanceof Array)?extras[i]:extra;
                  this.addChild($(children[i]) , extra);
      	}
      },
      newAuraComponent:function(componentName,opts){
            if (!componentName) return;
            var attributes='"';
            for (var i in opts) attributes+=' '+i+'="'+opts[i]+'"';
            var $child=$('<div><div data-aura-component="'+componentName+
                  attributes+'></div></div>');
            this.$("#children").append($child);
            if (this.sandbox) this.sandbox.start($child); //for Aura
            this.addChild($child);
      },      
      _addChild:function(child,extra) {
            //TODO check if pure dom object
            if (child instanceof $) {
                  var hview=child.data('hview');
                  if (!hview) { //handle <div><div data-aura-component></div></div>
                        hview=child.find("[data-aura-component]").data('hview');      
                  }
                  if (hview) {
                        this._addChild(hview,extra);
                  } else {
                        console.error(child[0].outerHTML,'set view type to Backbone.nested and call this.initNested()');
                  }
            } else {
                  if (!child) {
                        console.error('adding empty child');
                  } else if (child._parent) {
                        console.error('owned by ',child._parent);
                  } else {
                        child._parent=this;
                        if (_(this._children).indexOf(child) === -1) {
                              this._children.push(child);
                              var cb=child['onReady'];
                              if (cb) cb.apply(child,[extra]);
                        }                        
                  }
            }
      },
      addChild: function(child,extra) {
            if (!this._children) this._children=[];
            this._addChild(child,extra);
      },
      // Deregisters a subview that has been manually closed by this view
      removeChild: function(child) {
            this._children = _(this._children).without(child);
      },
      close:function() {
      	if (this.ondestroy) this.ondestroy();
      	if (this._parent) this._parent.removeChild(this);
      	this.remove();
      },
      commands:{},
      //send command to all children
      sendChildren:function() {
      	for (var i in this._children) {
      		var C=this._children[i];
			var func=C.commands[arguments[0]];
			var remain=Array.prototype.slice.apply(arguments,[1]);
                  if (typeof func==="string") {
                        var f=C[func];
                        if (f) func=f;
                        else {
                              console.error('function '+func+' not found');
                              return;
                        }
                  }
			if (func) func.apply(C,remain);
			//else console.warn('cannot send '+arguments[0]);
      	}
      	return this;
      },
      sendParent:function() { //send to parent
            if (!this._parent) {
                  console.error("no parent, check if type:Backbone.nested");
                  return;
            }
            var func=this._parent.commands[arguments[0]];
            var remain=Array.prototype.slice.apply(arguments,[1]);
            if (typeof func==="string") {
                  var f=this._parent[func];
                  if (f) func=f;
                  else {
                        console.error('function '+func+' not found');
                        return;
                  }
            }
            if (func) func.apply(this._parent,remain);
            
      },
      sendAll:function() { //send to all descendant
            for (var i in this._children) {
                  var C=this._children[i];
                  var func=C.commands[arguments[0]];
                  var remain=Array.prototype.slice.apply(arguments,[1]);
                  if (typeof func==="string") {
                        var f=C[func];
                        if (f) func=f;
                        else {
                              console.error('function '+func+' not found');
                              return;
                        }
                  }
                  if (func) func.apply(C,remain);
                  //else console.warn('cannot send '+arguments[0]);
                  C.sendChildren.apply(C,arguments);
            }
            return this;            
      },
      toString:function(indent) {
            indent=indent||"";
            for (var i in this._children) {
                  var C=this._children[i];
                  console.log(indent+" "+C.$el.data("aura-component"));
                  C.toString(indent+" ");
            }
      },
      constructor:function() {
            var instance=arguments[0]
            $(instance.el).data('hview',this);
            Backbone.View.apply(this, arguments);
            console.log('initialized',this.el)
            //this.$el.data('hview',this);
            this.parent=null;
      }
    });
    return nestedView;
});
/*
walk and return a hierachy
*/