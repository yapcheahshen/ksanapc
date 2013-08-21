if (typeof define !== 'function') { var define = require('amdefine')(module) }
define([], function () {
	var isCJK =function(c) {return ((c>=0x3400 && c<=0x9FFF) || (c>=0xD800 && c<0xDFFF) ) ;}

    var getutf32ch=function(ch) {
		return getutf32({widestring:ch});
	}
    var  getutf32 = function (opt) { // return ucs32 value from a utf 16 string, advance the string automatically
		opt.thechar='';
		if (!opt.widestring) return 0;
        var s = opt.widestring;
        var ic = s.charCodeAt(0);
        var c = 1; // default BMP one widechar
        if (ic >= 0xd800 && ic <= 0xdcff) {
          var ic2 = s.charCodeAt(1);
          ic = 0x10000 + ((ic & 0x3ff) * 1024) + (ic2 & 0x3ff);
          c++; // surrogate pair
        }
        opt.thechar = s.substr(0, c);
        opt.widestring = s.substr(c, s.length - c);
        return ic;
      };
			
      var ucs2string = function (unicode) { //unicode ¤º½XÂà ¦r¦ê¡A§textension B ±¡ªp
        if (unicode >= 0x10000 && unicode <= 0x10FFFF) {
          var hi = Math.floor((unicode - 0x10000) / 0x400) + 0xD800;
          var lo = ((unicode - 0x10000) % 0x400) + 0xDC00;
          return String.fromCharCode(hi) + String.fromCharCode(lo);
        } else {
          return String.fromCharCode(unicode);
        }
        
      };
      
      var kagecodepoint = function (s) { //uxxxx or uxxxxx
        if (s.length > 6)
          return 0;
        var unicode = (s.charAt(0) === 'u');
        if (unicode) {
          var cp = parseInt(s.substr(1, s.length), 16);
          if ((cp >= 0x3400 && cp <= 0x9FFF) || (cp >= 0x20000 && cp < 0x30000))
            return cp;
        } else
          return 0;
      };
			

	var enclosesurrogate=function(s,left,right) { // convert surrogate to \uXXXX
		var r="";
		left=left||"";
		right=right||"";
		var opt={widestring:s};
		
		var code=0;
		while(code=getutf32(opt)) {
			if (code>=0x20000) {
				r+=left+opt.thechar+right;
			} else {
				r+=opt.thechar;
			}
		}
		return r;
	}      
		
	var unique = function(ar){
	   var u = {}, a = [];
	   for(var i = 0, l = ar.length; i < l; ++i){
		  if(u.hasOwnProperty(ar[i])) {
			 continue;
		  }
		  a.push(ar[i]);
		  u[ar[i]] = 1;
	   }
	   return a;
	}
	var bigramof=function(s) {
		var r=[];
		var opts={};
		var i=0;
		opts.widestring=s;
		getutf32(opts);
		var ch=opts.thechar;
		while (ch) {
			getutf32(opts);
			if (opts.thechar && isCJK(ch.charCodeAt(0)) && isCJK(opts.thechar.charCodeAt(0))) {
				r.push(ch+opts.thechar);
			};
			ch=opts.thechar;
		}
		return unique(r);

	}
	var unigramof=function(s) {
		var r=[];
		var opts={};
		var i=0;
		opts.widestring=s;
		getutf32(opts);
		var ch=opts.thechar;
		while (ch) {
			getutf32(opts);
			if (isCJK(ch.charCodeAt(0))) r.push(ch);
			ch=opts.thechar;
		}
		return unique(r);
	}
		var cjkutil={};
		cjkutil.getutf32=getutf32;
		cjkutil.unigramof=unigramof;
		cjkutil.bigramof=bigramof;
		cjkutil.ucs2string=ucs2string;		
		cjkutil.kagecodepoint=kagecodepoint;
		//cjkutil.escapesurrogate=escapesurrogate;
		cjkutil.isCJK=isCJK;
		cjkutil.getutf32ch=getutf32ch;
		cjkutil.enclosesurrogate=enclosesurrogate;
		
    return cjkutil; // the cjk module
  });
 