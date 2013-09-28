die=function(msg) {
	throw msg;
}

var yadb=require('yadb');
if (process.argv.length<4) die('node dump db path')
var path=process.argv[3].split('.');

if (!path) die('cannot open db');

var ydb=new yadb.open(process.argv[2]);

console.log('dumpping ',path)
res=ydb.get(path,true);
console.log(res);