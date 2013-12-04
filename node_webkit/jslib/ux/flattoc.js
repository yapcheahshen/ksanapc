if (typeof define=='undefined') var define=function(body){ module.exports=body()};

/*
	given any node, find all ancestor and their siblings.
	and all childrens with siblings.

	for mac style finder.

*/

define(function(){
	var Toc=function(){

		var toc=null;
		var id='Toc'+Math.floor((Math.random()*1000));
		var set=function(t) {
			toc=t;
		}

		/* slot field doesn't need to be sorted
		   find the closest node
		*/
		var rangeend=function(slot) { // get the end of the node by slot
			if (!slot) return;
			var seq=closest(slot);
			var depth=toc[seq].depth;
			for (var i=seq+1;i<toc.length;i++) {
				if (toc[i].depth<=depth) {
					return toc[i].slot;
				}
			}
			return -1;
		};
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
				if (n<toc.length&&toc[n].depth==depth+1) {
					var S=getsibling(n);
					if (S.sibling.length==0) break;
					R[++depth]=S.sibling;
					R.lineage[depth]=n;
					n++;
				} else break;
			}
			
			return R;
		}
		this.set=set;
		this.goslot=goslot;
		this.go=go;
		this.closest=closest;
		this.rangeend=rangeend;
		return this;
	}
	
	return Toc;
})