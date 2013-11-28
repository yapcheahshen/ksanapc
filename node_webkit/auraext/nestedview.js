
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
      	this.$el.data('hview',this);
      },
      closeChildren:function() {
            for (var i in this._children) {
                  var C=this._children[i];
                  if (C.destroy) C.close(); else (C.remove());
            }
      },
      addChildren:function(attrname) { //automatic add all child view, call this after html()
      	attrname=attrname||'data-aura-widget'
      	var children=this.$("div["+attrname+"]");
      	this.closeChildren();
            this.children=[];
      	for (var i=0;i<children.length;i++) {
      		this.addChild($(children[i]));
      	}
      },
      newAuraComponent:function(componentName,opts){
            if (!componentName) return;
            var attributes='"';
            for (var i in opts) attributes+=' '+i+'="'+opts[i]+'"';
            var $child=$('<div><div data-aura-widget="'+componentName+
                  attributes+'></div></div>');
            this.$("#children").append($child);
            if (this.sandbox) this.sandbox.start($child); //for Aura
            this.addChild($child);
      },      
      _addChild:function(child) {

            //TODO check if pure dom object
            if (child instanceof $) {
                  var hview=child.data('hview');
                  if (!hview) { //handle <div><div data-aura-widget></div></div>
                        hview=child.find("[data-aura-widget]").data('hview');      
                  }
                  this.addChild(hview);
            } else {
                  if (!child) {
                        console.error('adding empty child');
                        return;
                  }
                  child._parent=this;
                  if (_(this._children).indexOf(child) === -1) {
                        this._children.push(child);
                  }
            }
            return child;
      },
      addChild: function(child) {
      	if (!child)return;
            if (!this._children) this._children=[];
            if (!this._children.length) {
                  //work around for first child is not initialized immediately
                  setTimeout(this._addChild.bind(this,child),200);      
            } else {
                  this._addChild(child);
            }
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
                  console.error('no parent');
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
                  C.send.apply(C,arguments);
            }
            return this;            
      }
    });
    return nestedView;
});