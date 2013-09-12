define(['./cjkutil','../base64','../kage/kage.amd'],function(cjkutil,Base64,kage) {
    var isCJK =function(c) {return ((c>=0x3000 && c<=0x9FFF) 
	|| (c>=0xD800 && c<0xDFFF) || (c>=0x2FF0 && c<0x2FFF) || (c>=0xFF00) ) ;}	

	//run in widget context
    var fetchglyph=function(title,$glyph,callback) {
      var opts={db:'glyphwiki',name:'getBuhins',params:[title]};
      var that=this;
      if (!this.fontcache) this.fontcache={};
      this.sandbox.yase.customfunc(opts,function(err,data){
        var buhins=Object.keys(data);
        for (var i in data) {
          if (!that.fontcache[i]) that.fontcache[i]=data[i];
        }
        callback(data,title,$glyph);
          //that.$el.html(JSON.stringify(data));
      })
    };

	var loadglyphs=function($el) {
		var glyphs=$el.find("img.glyphwiki");
		var that=this;
		var kage=new this.sandbox.kage.Kage();
		for (var i=0;i<glyphs.length;i++) {
			var title=glyphs[i].attributes["title"].value;
			var src=glyphs[i].attributes["src"].value;
			if (src) continue;//already has src data
			var glyphid='u'+ cjkutil.getutf32ch(title).toString(16);
			fetchglyph.apply(this,[glyphid,glyphs[i],function(buhins,glyphid,glyph){
		      var polygons=new that.sandbox.kage.Polygons();
		      for (var i in buhins) {
		        kage.kBuhin.push( i, buhins[i]) ;
		      }
		      kage.makeGlyph(polygons, glyphid);
		      var svg=polygons.generateSVG();
		      var widthbefore=$(glyph).css('height');
		      glyph.src="data:image/svg+xml;utf8,"+svg;
		      $(glyph).css("width",widthbefore);
		      $(glyph).css("height",widthbefore);
			}]);
		}
	}
    var tagify=function(text,opts) {
	 	opts=opts||{};
	 	opts.codestart=opts.codestart||0x20000  //0x2A700
	  	var i=0,code=0;
	  	var out="";
	  	var addtoken=function(j) {
	  		var code2=text.charCodeAt(j+1);
	  		if (code2>=0xDC00&&code2<=0xDFFF) {
	  			var sur= 0x10000+(code &0x3ff)*1024 + (code2&0x3ff) ;
	  		}
	  		if (sur>=opts.codestart) {
	  			var s=text[j]+text[j+1];
	  			//var data="";
	  			//var dataurl= "data:image/png;base64,"+Base64.encode(data);
	  			out+='<IMG class="glyphwiki" src="" title="'+s+'"/>';
 	  		} else {
 	  			if (sur) out+=text[j]+text[j+1];
 	  			else out+=text[j];
 	  		}
 	 	}
		var parseIDS=function(now) {
			var count=0;
			var start=now;
			while (count!=1 && now<text.length) {
				c=text.charCodeAt(now);
				if ( c>=0x2ff0 && c<=0x2fff) {
					count--;
				} else {
					count++;
					if (c>=0xD800 && c<0xDFFF) now++; //extension B,C,D
				}
				now++;
			}
			var data="";
			var dataurl= "data:image/png;base64,"+Base64.encode(data);
			out+='<IMG class="glyphwiki" src="" title="'+text.substring(start,now)+'"/>';
			return now;
		} 	 	
	  	while (i<text.length) {
	  		var code=text.charCodeAt(i);
			if (isCJK(code)) {
				if (code>=0x2ff0 && code<=0x2fff) {
					i=parseIDS(i);
				} else {
					addtoken(i);
					if (code>=0xD800 && code<0xDFFF) i++; //extension B,C,D
					i++;
				}
			} else {
				out+=text[i];
				i++;
			}
	  	}
	  	return out;
    }
  var api={};
  api.tagify=tagify;
  //api.fetchglyph=fetchglyph;
  api.loadglyphs=loadglyphs;
  return api;
});