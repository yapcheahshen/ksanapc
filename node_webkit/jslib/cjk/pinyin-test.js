var vows = require('vows'),
    assert = require('assert'),
    pinyin=require('./pinyin');

vows.describe('zhuyin 2 pinyin test').addBatch({
 'simple': {
    topic: function () {
    	return [
    		["ㄉㄨㄥ-","dong"],
    		["ㄧ","yi"],
            ["ㄉㄧˊ","di2"],
            ["ㄇㄠˇ","mao3"],
    	];
    },
	simple:function(topic) {
		for (var i in topic) {
			assert.equal(pinyin.fromzhuyin(topic[i][0]),topic[i][1]);
		}
	}
}
}).export(module); // Export the Suite;