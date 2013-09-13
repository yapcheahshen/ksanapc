define(['../jslib/base64','../jslib/kage/kage.amd','../jslib/cjk/dgg'],
	function(Base64,Kage,dgg){
	var imagearrive=function(nimg) {
	  return function(err,data){
	    if (data) { //convert to base64
	      var dataurl= "data:image/png;base64,"+Base64.encode(data)
	      nimg.attr('width','10%');
	      nimg.attr('height','10%');
	      nimg.attr('src',dataurl);
	      nimg.addClass('eudc');
	    }
	  }
	}
	var loadimages=function($el) {
	  var images=$el.find("img[title]");
	  var sandbox=this.sandbox;
	  for (var i=0;i<images.length;i++) {
	    $img=$(images[i]);
	    var yase=this.sandbox.yase;
	    var fn=$img.attr("title").substring(1); //remove &
	    fn=fn.substring(0,fn.length-1);//remove ;
	    var blobpath='images/'+fn+'.png';
	    yase.getBlob({db:this.db, blob:blobpath}, 
	      this.sandbox.imagearrive($img));
	  }
	};
return {

  initialize: function(app) {
  		app.sandbox.loadimages=loadimages;
  		app.sandbox.imagearrive=imagearrive;
  		app.sandbox.kage=Kage;
  		app.sandbox.kagecache={}; 
  },
  afterAppStart: function() {
  }
  
}});