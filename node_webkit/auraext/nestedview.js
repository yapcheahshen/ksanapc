
/* backbone nested view extension 
inspired from 
http://blog.shinetech.com/2012/10/10/efficient-stateful-views-with-backbone-js-part-1/
http://bardevblog.wordpress.com/2012/12/13/re-learning-backbone-js-nested-views/
*/
define(['jquery','underscore','backbone'],function($,_,Backbone){
	var nestedView=Backbone.View.extend({
      $yase: function(){ //promise interface
            return this.sandbox.$yase.apply(this,arguments)
      },
      _children:[],
      init:function() { //maybe removed if aura provide a hook..
      	this.$el.data('hview',this);
      },
      closeChildren:function() {
            for (var i in this._children) {
                  var C=this._children[i];
                  if (C.destroy) C.close(); else (C.remove());
            }
      },
      addChildren:function(classname) {
      	//automatic add all child view, call this after html()
      	classname=classname||'data-aura-widget'
      	var children=this.$("div."+classname);
      	this.closechildren();
      	for (var i=0;i<children.length;i++) {
      		var hview=children[i].data(hview);
      		this.addchild(hview);
      	}
      },
      newAuraComponent:function(componentName,opts){
            if (!componentName) return;
            var attributes='"';
            for (var i in opts) {
                  attributes+=' '+i+'="'+opts[i]+'"';
            }
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
                  child._parent=this;
                  if (_(this._children).indexOf(child) === -1) {
                        this._children.push(child);
                  }
            }
            return child;
      },
      addChild: function(child) {
      	if (!child)return;      	
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
      receive:{},
      //send command to all children
      send:function() {
      	for (var i in this._children) {
      		var C=this._children[i];
      		if (typeof C.receive=='function'){
      			C.receive(arguments);
      		} else { // events-like comand map
      			var func=C.receive[arguments[0]];
      			var remain=Array.prototype.slice.apply(arguments,[1]);
      			if (func) func.apply(C,remain);
      			//else console.warn('cannot send '+arguments[0]);
      		}
      	}
      	return this;
      },
      sendAll:function() { //send to all descendant
            for (var i in this._children) {
                  var C=this._children[i];
                  if (typeof C.receive=='function'){
                        C.receive(arguments);
                  } else { // events-like comand map
                        var func=C.receive[arguments[0]];
                        var remain=Array.prototype.slice.apply(arguments,[1]);
                        if (func) func.apply(C,remain);
                        //else console.warn('cannot send '+arguments[0]);
                  }
                  C.send.apply(C,arguments);
            }
            return this;            
      }

    });
    return nestedView;
});