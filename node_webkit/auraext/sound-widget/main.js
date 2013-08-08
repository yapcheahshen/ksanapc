define(['underscore','text!./sound.tmpl','backbone','../../../launcher/howler'], 
 function(_,template,Backbone,howler) {
  return {
   type:"Backbone",
   events:{
   	"click #btnstop":"stopclick",
   	"click #btnpos":"position",
   	"click tk":"tokenclick",
   	"click #btnstartmap":"startmapping",
   	"click #btnstartplay":"startplaying",
   	"click #btnsave":"saveclick",
    "click #btndiscard":"discardclick"
   },
   nexttoken:function(tk) {
   	n=tk.next();
   	if (n) return n;
   	var nextslot=tk.parent().next();
   	if (nextslot[0].nodeName=='SLOT') return $(nextslot.children()[0]);
   },
   tokendistance:function(start,end) {
   	var d=0;
   	for (var tk=start;tk!=end && tk.length; tk=this.nexttoken(tk) ) d++;
   	return d;
   },
   closesttoken:function(sp) {
   	for (var i=0;i<this.map.length;i++) {
   		if (this.map[i][0]>sp && i) {
   			var timediff=this.map[i][0]-this.map[i-1][0];
   			var percent=  ((sp-this.map[i-1][0])/timediff);
   			prevstamp=this.tokenfromvpos(this.map[i-1][1]);
   			thisstamp=this.tokenfromvpos(this.map[i][1]);
   			var distance=this.tokendistance(prevstamp,thisstamp);
   			var adv=Math.round(percent*distance);
   			$tk=prevstamp;
   			for (var i=0;i<adv;i++) $tk=this.nexttoken($tk);
   			return $tk;
   		}
   	}
   },
   startplaying:function(e) {
   	if (this.playing) return;
   	var that=this;
   	this.playing=true;
   	this.sound.play();
   	this.model.set({"mode":"playing"});
   	this.timer=setInterval( function() {
   		var sp=Math.floor(that.sound.pos()*1000);
   		var tk=that.closesttoken(sp);
   		that.rendertill(tk,'played');
   	},300);
   },
   startmapping:function(e) {
   	//this.sound.stop();
      this.$el.find("tk.played").removeClass("played");
   	this.sound.play();
   	this.map=[];
   	this.model.set({"mode":"mapping"});
   	this.domapping=true;
   },
   position:function(e) {
   	$(e.target).html( this.sound.pos() );
   },
   discardclick:function() {
      this.readmapping();
      this.model.set({mode:"ready"});
      this.$el.find("tk.hover").removeClass("hover");
   },
   stopclick:function() {
   	this.playing=false;
   	this.domapping=false;
   	clearInterval(this.timer);
   	var that=this;
   	this.sound.stop();
      if (this.model.get("mode")=="mapping") {
        this.model.set({"mode":"mappingdone"});  
      } else {
        this.model.set({"mode":"ready"});  
      }
   	
   },
    vposfromtoken:function(tk) {
      var token=tk.attributes['n'].value;
      var slot=tk.parentNode.attributes['n'].value;
      return parseInt(slot)*4096+parseInt(token) ;
    },   
    tokenfromvpos:function(vpos) {
        var slot=Math.floor(vpos /4096);
        var $slot=this.slot2dom[slot];
        if (!$slot) $slot=this.slot2dom[slot]=this.$el.find('slot[n='+slot+']');
        return $slot.find('tk[n='+vpos %4096+']');
    },     
    saveclick:function(e) {
    	var zdb=this.db+'/zdb/timestamp.zdb';
    	var data={time:new Date(), data: this.map};
    	var that=this;
    	this.sandbox.dirty.set( {db:zdb , key: this.start, value: data} , function(err,written){
    		that.model.set({message:written+ ' bytes written', mode:"ready"})
    	});
    },
    soundposfromtk:function($tk) {
    	var vpos=this.vposfromtoken($tk[0]);
    	for (var i in this.map) {
    		if (this.map[i][1]>vpos) return this.map[i-1][0]
    	}
    },
   tokenclick:function(e) {
   	var $tk=$(e.target);
   	if (this.domapping) {
	   	var p=Math.floor(this.sound.pos()*1000);
	   	var vpos=this.vposfromtoken($tk[0]);
	   	this.map.push([ p, vpos ]);
	   	$("#soundpos").html(p);   		
   	} else if (this.playing) {
   		var p=this.soundposfromtk($tk) / 1000;
   		this.sound.pos(p);
   	}
   	this.rendertill($(e.target),'hover');
   },
   rendertill:function($tk,classname) {
   	if (!$tk || !$tk.length) return;
   	this.$el.find("."+classname).removeClass(classname);
   	$tk.addClass(classname);
   	$tk.prevAll().addClass(classname);
   	$tk.parent().prevAll().children().addClass(classname);
   },
   render:function(d1,d2) {
   	//console.log('yap2@tofind',this.sandbox.yap2); //this is undefined
      var that=this;
      var o={db:this.db, start:this.start,end:this.end,tokentag:true, slottag:true};
      this.sandbox.yadm.getTextRange(o, function(err,data) {
        var obj={text:data};
        that.html(_.template(template,obj));
        that.updateui();
      });

    },
    showmessage:function(m) {
    	$("#message").html(m.get("message"));
    },

    readmapping:function() {
    	var that=this;
    	var zdb=this.db+'/zdb/timestamp.zdb';
    	this.sandbox.dirty.get( {db:zdb , key: this.start} , function(err,data){
    		if (data && data.data) that.map=data.data;
    	});        	

    },
    updateui:function() {
    	$("#btnstartplay").hide();
      $("#btndiscard").hide();
    	$("#btnstartmap").hide();
    	$("#btnstop").hide();
    	$("#btnsave").hide();
    	var mode=this.model.get("mode");
    	if (mode=="ready") {
    		if (this.map.length) $("#btnstartplay").show();
            this.$el.find("tk.hover").removeClass("hover");
            this.$el.find("tk.played").removeClass("played");
    		$("#btnstartmap").show();
    	} else if (mode=="playing" || mode=="mapping") {
    		$("#btnstop").show();
    	} else if (mode=="mappingdone") {
    		$("#btnsave").show();
           $("#btndiscard").show();
    	}
    },
    initialize: function() {
    	this.start=this.options.start;
    	this.end=this.options.end;
    	this.db=this.options.db;
    	this.model=new this.sandbox.mvc.Model();
    	this.model.on("change:message",this.showmessage,this);
    	this.model.on("change:mode",this.updateui,this);
        	this.render();
        	this.map=[];
        	this.slot2dom={};//cache;
        	this.readmapping();
        	var that=this;
        	this.sound = new howler.Howl({
        		onload:function(){ that.model.set({"mode":"ready"})},
        		onend:function(){ that.stopclick()},
        		urls: ['mp3/chi.mp3']
        	});
    }

  };
});
