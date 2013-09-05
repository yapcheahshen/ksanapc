if (typeof define=='undefined') {
	define=function(s) {module.exports=s()}
}

define(function() {
	var consonants={
		"ㄅ":"b","ㄆ":"p","ㄇ":"m","ㄈ":"f","ㄉ":"d" ,
		"ㄊ":"t" ,"ㄋ":"n", "ㄌ":"l",  "ㄍ":"g", "ㄎ":"k",
		"ㄏ":"h" , "ㄐ":"j","ㄑ":"q","ㄒ":"x", "ㄓ":"zh",
		"ㄔ":"ch","ㄕ":"sh","ㄖ":"r","ㄗ":"z","ㄘ":"c","ㄙ":"s"};
	var vowels=
	{"ㄚ":"a","ㄛ":"o", "ㄜ":"e" ,"ㄝ":"e" , 
	"ㄞ":"ai","ㄟ":"ei","ㄠ":"ao","ㄡ":"ou" ,"ㄢ":"an",
	"ㄣ":"en","ㄤ":"ang","ㄥ":"eng","ㄦ":"er"};

	var complexvowels={

	"ㄧ":{"ㄧ":["i","yi"],"ㄧㄚ":["ia","ya"], "ㄧㄛ":["io","yo"],
	 "ㄧㄝ":["ie","ye"],"ㄧㄠ":["iao","yao"],"ㄧㄡ":["iu","you"],
	 "ㄧㄢ":["ian","yan"],"ㄧㄣ":["in","yin"],"ㄧㄤ":["iang","yang"],"ㄧㄥ":["ing","ying"]},
	"ㄨ":{"ㄨ":["u","wu"],"ㄨㄚ":["ua","wa"], "ㄨㄛ":["uo","wo"],
	 "ㄨㄞ":["uai","yai"],"ㄨㄟ":["ui","wei"],
	 "ㄨㄢ":["uan","wan"],"ㄨㄣ":["in","yin"],"ㄨㄤ":["uang","wang"],"ㄨㄥ":["ong","weng"]},
	"ㄩ":{"ㄩ":["u","yu"], 
	 "ㄩㄝ":["ue","yue"],"ㄩㄢ":["uan","yuan"],"ㄩㄣ":["un","yun"]
	 ,"ㄩㄥ":["iong","yong"],"ㄋㄩ":["",""],"ㄌㄩ":["",""]}
	};

	var tones={"－":"1","ˊ":"2","ˇ":"3","ˋ":"4","·":"5"};

 	var fromzhuyin=function(zy) {
 		var out="";
 		var c=consonants[zy[0]];//子音
 		if (c) out+=c;

 		var v=c?zy.substring(1):zy;//母音
 		if (vowels[v[0]]) {
 			out+=vowels[v[0]];
 			t=v.substring(1);
 		} else if (complexvowels[v[0]]) {
 			var map=complexvowels[v[0]];
 			if (v.length>1 && map[v[0]+v[1]]) {
 				if (c)  out+=map[v[0]+v[1]][0];
 				else out+=map[v[0]+v[1]][1]
 				t=v.substring(2);
 			} else if (map[v[0]]) {
 				if (c) out+=map[v[0]][0];
 				else out+=map[v[0]][1]
 				t=v.substring(1);
 			}
 		} else return out;

 		if (tones[t]) out+=tones[t];

 		return out;
	}
	var tozhuyin=function(){}

	return {fromzhuyin:fromzhuyin, tozhuyin:tozhuyin};
})