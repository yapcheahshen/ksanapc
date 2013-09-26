/*
	if you don't want any folder to be update automatically.
	put the appname inside	udpateskip.json 
	one appname per line.
*/
var fs=require('fs');
var skips=[];
if (fs.existsSync('updateskip.json')) {
	var skips=fs.readFileSync('updateskip.json','utf8').replace(/\r\n/g,'\n').split('\n');
}
var files=fs.readdirSync('.');
var dirs=[];
for (var i in files) {
	if (files[i]=='.git') continue;
	var stats = fs.lstatSync(files[i]);
	if (stats.isDirectory() && fs.existsSync(files[i]+'/.git') && skips.indexOf(files[i])==-1) 
		dirs.push(files[i]);
}

var getgiturl=function(folder) {
	var url=fs.readFileSync(folder+'/.git/config','utf8');//.match(/url = (.*?)\n/);
	url=url.substr(url.indexOf('url ='),100);
	url=url.replace(/\r\n/g,'\n').substring(6,url.indexOf('\n'));
	return url;
}

var now=0;
var dofile=function() {
	if (now>=dirs.length) return;
	var giturl=getgiturl(dirs[now]);
	console.log('git update',giturl);

	process.chdir(dirs[now]);
	var git=require('child_process').exec('git pull origin master',function(error,stdout,stderr){
		if (error) {
			console.log("ERROR",error);
		}
	 	console.log(stdout);
	 	console.log(stderr);
	 	now++;
	 	process.chdir('..');
	 	dofile();
	});
}


dofile();