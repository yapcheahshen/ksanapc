define(['cjkutil','strokecount'], function(cjkutil,strokecount){

  var str2arr=function(s) {
		var output=[];
		var opt={widestring:s};
		var code=0;
		while (code=cjkutil.getutf32(opt)) {
			output.push(code);
		}
		return output;
  }
	
  var getderived=function( opt ) {
	  var r=opt.map[opt.widestring];
	  if (typeof r=="string") {
		return  str2arr(r);
	  }	else {
		 var ic=cjkutil.getutf32(opt);
		return opt.map[ic.toString()]; //old format
	  }
  
  }
  
  
  var remove_once=function(arr) {  // [ 1, 2, 2, 3, 3, 3 ] ==> [ 2, 3, 3]
  	  var prev=null;
  	  var output=[];
  	  for (var i=0;i<arr.length;i++) {
  	  	  if (prev===arr[i]) output.push(prev);
  	  	  prev=arr[i];
  	  }
  	  return output;
  }  
   var array_unique=function(arr) { //must be sorted array   [ 1, 2, 2, 3, 3, 3 ] ==> [ 1, 2, 3]
	 if (!arr.length) return [];
     var ret = [arr[0]];
     for (var i = 1; i < arr.length; i++) { // start loop at 1 as element 0 can never be a duplicate
        if (arr[i-1] !== arr[i])  ret.push(arr[i]);
     }
     return ret;
  }
  var array_intersect = function() { // ( [ 1,2,3]  , [ 2 , 2 , 3] ) ==>  [ 2 , 3]
    if (!arguments.length) return [];
    var a1 = arguments[0];
    var a = arguments[0];
    var a2 = null;
    var n = 1;
    var l,l2,jstart;
    if (!a1 || !a1.length)return [];
    while(n < arguments.length) {
      a = [];
      a2 = arguments[n];
      l = a1.length;
      if (!a2) return [];
      l2 = a2.length;
      jstart=0;
      for(var i=0; i<l; i++) {
        for(var j=jstart; j<l2; j++) {
          if (a2[j]>a1[i]) break;
          if (a1[i] === a2[j]) {
			a.push(a1[i]);
		  }
        }
        jstart=j;
      }
      a1 = a;
      n++;
    }
    return array_unique(a);
  }  
  
  var filterstroke=function(arr,totalstroke) {
	var output=[];
	for (var i=0;i<arr.length;i++) {
		if (strokecount(arr[i])==totalstroke) output.push(arr[i]);
	}
	return output;
  }
	var moveexta=function(res) { //move extension A after BMP
		var output=[];
		for (var i in res) {
			if (res[i]>=0x4e00 && res[i]<0x9fff) {
				output.push(res[i]);
			}
		}
		for (var i in res) {
			if (res[i]<0x4e00 || res[i]>=0x20000) {
				output.push(res[i]);
			}
		}
		return output;
	}

    var gsearch=function(map,wh) {
       var arg=[], derived=[];
       var prev="",glypheme=[];
       var opt={widestring:wh};
	   var numbers=wh.match(/\d+/g);
	   var remainstroke=0;
	   for (var i in numbers) remainstroke+=parseInt(numbers[i],10);

       while (opt.widestring!=="") {
       	  var code=cjkutil.getutf32(opt);
		  if ((code>=0x3400 && code<=0x9fff) ||
		     (code>=0x20000 && code<0x2ffff) ||
			 (code>=0xe000 && 0xf8ff) )
       	  glypheme.push(opt.thechar);
       }
	   
		if (glypheme.length==0) return [];
		if (glypheme.length==1) {
			var r=getderived({map:map, widestring:glypheme[0]} );
			if (remainstroke) {
				var stroke=strokecount(glypheme[0]) + remainstroke;
				return moveexta(filterstroke(r,stroke));
			}
			if (r) r.unshift(cjkutil.getutf32({widestring:glypheme[0]}));
			return  moveexta(r)||[];
		}
		glypheme.sort(); // 口木口木 ==> 口口木木
		var partstroke=0;
		for (var i=0;i<glypheme.length;i++) {
			partstroke+=strokecount(glypheme[i]);
			if (prev===glypheme[i]) { // for search repeated part
			   derived=remove_once(derived);
			} else {
			   derived=getderived( {map:map, widestring:glypheme[i]} );
			}
			if (derived==="") return [];
			arg.push( derived );
			prev=glypheme[i];
  	 }
  	 var res=array_intersect.apply(null, arg);
  	 for (var i=0;i<glypheme.length;i++) {
  	 	res.unshift(cjkutil.getutf32({widestring:glypheme[i]}));
  	 }
	 if (remainstroke|| (numbers && numbers.length)) {
		var stroke=partstroke + remainstroke;
		return moveexta(filterstroke(res,stroke));	 
	 }
	 return moveexta(res);
  }
  //export for testing
  gsearch.remove_once=remove_once;
  gsearch.array_unique=array_unique;
  gsearch.array_intersect=array_intersect;
  gsearch.withstroke=strokecount.withstroke;
  return gsearch;
});