
/*
	handling parallel reading
	dirty key is the source starting point
	target and starting point
	[ //array of links, each link is an array of two items
	 [[sourceslot,[s1,s2,s3]], [targetslot,[targettoken,targettoken]]]  // one source, one target
	 [[sourceslot,[s1,s2,s3],sourceslot,[s1,s2]], [targetslot,[t2,t2], targetslot,[t1,t2]]], //two source slot, two target slot
 	]
 	slot and token are offset to starting point,
 	so pick a starting point which are durable to text changes.
*/
define({
  	initialize: function(app) {
  		
	},
	/* convert in-disk links to per-db perspective
	    so that each paratext knows how to render itself and target paratext
	    convert into these format for easy rendering dom.
	    targetdb, [source vpos array], [target vpos array] // from source to target
	    sourcedb, [target vpos array], [source vpos array] // opposite way
	 */

	unpack:function(key,sourcedb,sourcestart,targetdb,targetstart,data) {
		var mvc=this.app.sandbox.mvc;
		var C=this.app.mappings[key];
		C.sourcedb=sourcedb,C.sourcestart=sourcestart;
		C.targetdb=targetdb,C.targetstart=targetstart;

		var models=[],models2=[];
		for (var i in data) { //source perspective
			var s=data[i][0], t=data[i][1], g1=[],g2=[];
			for (var j=0;j<s.length/2;j++) { // if s.length>2 means cross sentence
				for (var k in s[j*2+1]) g1.push( (sourcestart+parseInt(s[j*2])-1)*4096+parseInt(s[j*2+1][k]) );
				for (var k in t[j*2+1]) g2.push( (targetstart+parseInt(t[j*2])-1)*4096+parseInt(t[j*2+1][k]) );
			}
			var extra=data[i][2]||{};
			models.push( new mvc.Model(
			{sourcedb:sourcedb,targetdb:targetdb,source:g1,target:g2,extra:extra} ));
		}
		C.reset(models);
		this.app.sandbox.emit('parallel.loaded', targetdb);
	},
	loadshadow:function(targetdb,targetstart) {
		console.log('load shadow',targetdb,targetstart)
		var ckey=targetdb+'.'+targetstart;
		var models=[];
		var mvc=this.app.sandbox.mvc;
		this.shadowcollection=new mvc.Collection();
		for (var i in this.collection.models) {
			var m=this.collection.models[i];
			models.push( new mvc.Model(
			{sourcedb:m.get("targetdb"),targetdb:m.get("sourcedb")
			,source:m.get("target"),target:m.get("source"),extra:m.get("extra")} ));
		}
		this.app.sandbox.emit('parallel.setcollection.'+ckey, this.shadowcollection);
		this.shadowcollection.reset(models);
	},
	load:function(db, key) {
		console.log('loading ',db,key)
		var sandbox=this.app.sandbox;
		var zdb=db+'/zdb/mapping.zdb';
		var that=this;
		var ckey=db+'.'+key;
		var C=this.app.mappings[ckey];
		if (!C)  C=this.app.mappings[ckey]=new this.app.sandbox.mvc.Collection();
		C.sourceselector=key;
		this.app.sandbox.emit('parallel.setcollection.'+ckey, C);
		this.collection=C;
		C.zdb=zdb;
		var loadfromdirty=function(start) {
			sandbox.dirty.get({db:zdb,key:key},function(err,data){
				if (data) {
					C.targetselector=data.start;
					if (typeof C.targetselector=='string') {
						that.app.sandbox.yadm.findTag({db:data.target, selector:data.start},function(err,data2){
							that.unpack(ckey,db,start,data.target,data2.slot ,data.data);
						});
					} else that.unpack(ckey,db,start,data.target,data.start,data.data);
				}
			});			
		}
		if (typeof key=='string') {
			this.app.sandbox.yadm.findTag({db:db, selector:key},function(err,data){
				loadfromdirty(data.slot);
			});
		} else loadfromdirty(parseInt(key));
	},
	pack:function() {
		var convert=function (vposarr,start) {
			var o={};
			for (var j in vposarr) { //group tokens by slot
				var slot=(Math.floor(vposarr[j] / 4096) - start) +1
				var token=vposarr[j] % 4096;
				if (!o[slot]) o[slot]=[];
				o[slot].push(token);
			}			
			var output=[], keys=Object.keys(o);
			for (var i in keys) { //convert to array
				output.push(keys[i]);
				output.push(o[keys[i]]);
			}
			return output;
		}		
		var S=this.collection;
		var sourcestart=S.sourcestart;
		var targetstart=S.targetstart;
		var links=[];
		for (var i in S.models) { //links
			var i1=convert(S.models[i].get("source"),sourcestart);
			var i2=convert(S.models[i].get("target"),targetstart);
			var extra=S.models[i].get("extra");
			links.push([i1,i2,extra]);
		}
		return links;
	},
	save:function(db,key,data) {
		var s=this.collection;
		var sandbox=this.app.sandbox;
		var time=new Date();
		var data={time :time, target: s.targetdb, start:s.targetselector , data:this.pack() }
		sandbox.dirty.set({db:s.zdb,key: s.sourceselector,value : data},function(err,written){
			console.log('written',written)
			sandbox.emit('parallel.linksaved',written, time);
		})
	},
	reverselink:function(link) {
		return {sourcedb:link.targetdb,source:link.target,targetdb:link.sourcedb,target:link.source};
	},
	addlink:function(link) {
		//var db1=this.collection.models[0].get("sourcedb");
		this.collection.add(link);
		if (this.shadowcollection) this.shadowcollection.add(this.reverselink(link));
		this.app.sandbox.emit('parallel.linkadded',link);
	},
	removelink:function(link) {
		var db1=this.collection.models[0].get("sourcedb");
		link=link.toJSON();
		if (link.sourcedb != db1) link=this.reverselink(link);//when user select target paragraph

		this.collection.remove(this.collection.where(link));
		if (this.shadowcollection) {
			this.shadowcollection.remove(this.shadowcollection.where(this.reverselink(link)));
		}
		this.app.sandbox.emit('parallel.linkremoved',link);
	},
	afterAppStart: function(app) {
		this.app=app;
		app.mappings={}; // hold collections of mappings
	 	app.sandbox.on('parallel.load',this.load,this);
	 	app.sandbox.on('parallel.loadshadow',this.loadshadow,this);
	 	app.sandbox.on('parallel.save',this.save,this);
	 	app.sandbox.on('parallel.addlink',this.addlink,this);
	 	app.sandbox.on('parallel.removelink',this.removelink,this);
  	}
});