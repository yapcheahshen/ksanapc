/*
 aem browser side library
 */

 define(['underscore','backbone'],function(_,Backbone) {
 	var AEM=Backbone.Model.extend({
 		vpos: 0,
 		tagname:"",
 		//author: "",
 		extra: null,
 		slot : function() { return Math.floor(this.get("vpos") / 4096) },
 		token: function() { return this.get("vpos") % 4096 },
 		initialize: function() {
 			this.time= new Date();
 		}
 	})
 	var AEMCollection=Backbone.Collection.extend( {
 		model: AEM,
 	});


 	return {
 		AEMCollection:AEMCollection
 	}
 });