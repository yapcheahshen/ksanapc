var vows = require('vows'),
    assert = require('assert'),
    flattoc=require('../flattoc');
vows.describe('flat toc test suite').addBatch({
	/*
    'flattoc': {
        topic: function () {
        		toc= require('./sampletoc')
        		flattoc.set(toc);
        		return toc;
	},
	closest:function(topic) {
		assert.equal(flattoc.closest(4),-1);
		assert.equal(flattoc.closest(56),6);
		assert.equal(flattoc.closest(60),7);
		assert.equal(flattoc.closest(61),7);
		assert.equal(flattoc.closest(200),19);
	},
	lineage1:function(topic) {
		var r=flattoc.goslot(56);
		assert.deepEqual(r[0],[0]);
		assert.deepEqual(r[1],[1,2,16]);
		assert.deepEqual(r[2],[3,4,15]);
		assert.deepEqual(r[3],[5,6]);
		assert.deepEqual(r[4],[7,12]);
		assert.deepEqual(r[5],[8,9,10]);
		assert.deepEqual(r[6],undefined);
		
		assert.deepEqual(r.lineage,[0,2,4,6,7,8]);

	},
	
	lineage2:function(topic) {
		var r=flattoc.goslot(68);		
		assert.deepEqual(r[0],[0]);
		assert.deepEqual(r[1],[1,2,16]);
		assert.deepEqual(r[2],[3,4,15]);
		assert.deepEqual(r[3],[5,6]);
		assert.deepEqual(r[4],[7,12]);
		assert.deepEqual(r[5],[8,9,10]);
		assert.deepEqual(r[6],[11]);
		assert.deepEqual(r.lineage,[0,2,4,6,7,10,11]);

	},
	lineage_outofrange:function(topic) {
		var r=flattoc.goslot(0);		
		assert.deepEqual(r,{lineage:[]});
	},
	lineage_first:function(topic) {
		var r=flattoc.goslot(5);
		assert.deepEqual(r[0],[0]);
		assert.deepEqual(r[1],[1,2]);
		assert.equal(r[2],undefined);
		assert.equal(r[3],undefined);
		assert.deepEqual(r.lineage,[0,1]);
	}
},*/
	'flattoc2': {
        topic: function () {
        toc= require('./sampletoc2')
        flattoc.set(toc);
        return toc;
	},
	lineage:function(topic) {
		var r=flattoc.go(11);	
		assert.deepEqual(r.lineage,[0,9,11]);
		assert.deepEqual(r[0],[0,13,24,25]);
		assert.deepEqual(r[1],[1,5,9]);
		assert.deepEqual(r[2],[10,11,12]);
	},
	lineage2:function(topic) {
		var r=flattoc.go(14);	
		console.log(r)	
		assert.deepEqual(r.lineage,[13,14]);
		assert.deepEqual(r[0],[0,13,24,25]);
		assert.deepEqual(r[1],[14,21]);
		assert.deepEqual(r[2],[15,18]);
		assert.deepEqual(r[3],[16]);
		assert.deepEqual(r[4],[17]);
	}

}	

}).export(module); // Export the Suite