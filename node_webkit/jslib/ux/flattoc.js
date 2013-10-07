if (typeof define=='undefined') var define=function(body){ module.exports=body()};

/*
	given any node, find all ancestor and their siblings.
	and all childrens with siblings.

	for mac style finder.

*/

define(function(){
	var toc=null;
	var set=function(t) {
		toc=t;
	}

	/* slot field doesn't need to be sorted
	   find the closest node
	*/
	var closest=function(slot) {
		var min=0xffffffff;
		var closest=-1;
		for (var i=0;i<toc.length;i++) {
			if (toc[i].slot<=slot&&slot-toc[i].slot<min) {
				closest=i;
				min=slot-toc[i].slot;
			}
		}
		return closest;
	}
	var goslot=function(slot) {
		var seq=closest(slot);
		return go(seq);
	}
	var go=function(seq) {
		var R={ lineage:[]};
		if (seq<0 || seq>=toc.length) return R;
		var getsibling=function(now) {
			var sibling=[],parent=0;
			var D=toc[now].depth;
			for (var i=now-1;i>=0;i--) {
				if (toc[i].depth==D) sibling.unshift(i);
				else if (toc[i].depth<D) {
					parent=i;
					break;
				}
			}
			for (var i=now;i<toc.length;i++) {
				if (toc[i].depth==D) sibling.push(i);	
				else if (toc[i].depth<D) break;
			}
			return {sibling:sibling, parent:parent};
		}
		var n=seq;
		var depth=toc[n].depth;
		while (depth>=0) { //parents
			R.lineage[depth]=n;
			var S=getsibling(n);
			R[depth]=S.sibling;
			n=S.parent;
			depth--;
		}
		var depth=toc[seq].depth;
		var n=seq+1;
		while (true) { //children
			
			if (toc[n].depth==depth+1) {
				var S=getsibling(n);
				if (S.sibling.length==0) break;
				R[++depth]=S.sibling;
				R.lineage[depth]=n;
				n++;
			} else break;
		}
		
		return R;
	}
	var go1=function(seq) { //one pass!
		var R={ lineage:[]};
		if (seq<0) return R;
		var terminator=-1;
		var depth=toc[seq].depth;
		var outofrange=false,closing=false;
		var opening=function(d) {
			return R[d][R[d].length-1]!=terminator;
		}
		var close=function(d) {
			while (R[d] && R[d].length && opening(d)) {R[d++].push(terminator)};
		}
		for (var i=0;i<toc.length;i++) {
			var D=toc[i].depth;
			if (!R[D]) R[D]=[];
			if (D<depth) { //ancestor
				if (opening(D)) {
					R[D].push(i);
					if (outofrange) close(D); 
				}	
			} else {
				if (toc[i].depth==depth) { //same level
					if (opening(D)) R[D].push(i);
				} else { //children
					if (R[D-1].length&&opening(D-1)) {
						R[D].push(i);
						if (outofrange) {
							close(D-1); //close parent
							if (i<toc.length-1&&toc[i+1].depth==D) close(D);
						}
					}
				}
			}
			if (!outofrange && !closing) R.lineage[D]=i;
			if (!outofrange && i>=seq ) { 
				if (seq+1<toc.length&&toc[seq+1].depth>=D) {
					if (toc[seq+1].depth==D+1) seq++; //dig into deeper level automatically
					else closing=true;//which reach here, any change in depth will be consider at bottom part
					depth=D;
					if (i+1<toc.length&&toc[i+1].depth==D+1&&closing){
						outofrange=true;
						close(D);
					} 
				} else {
					outofrange=true;
				}
			}
		}
		//remove empty sibling and pop terminator
		for (var i in R) {
			if (!opening(i)) R[i].pop();
			if (R[i]&&!R[i].length) delete R[i];
		}

		return R;
	}
	return { set:set, goslot:goslot ,go:go, closest:closest};
})