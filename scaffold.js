/*
   copy files from %scaffold% to newly created git repo
   replace %scaffold% to appname
*/
var fs=require('fs');
var argv=process.argv;
var app=argv;
app.shift();app.shift();
var appname=app[0];
var forcecreate=app.length>2 &&app[2]=='--overwrite';
var templatepath=(app[1]||"kse") +'/';
var path=require('path');
var tobecopied=0;
if (!fs.existsSync(templatepath+'/%scaffold%')) {
	console.log(templatepath+' has no scaffold template');
	return;
}
var getgiturl=function() {
	var url=fs.readFileSync(appname+'/.git/config','utf8');//.match(/url = (.*?)\n/);
	url=url.substr(url.indexOf('url ='),100);
	url=url.replace(/\r\n/g,'\n').substring(6,url.indexOf('\n'));
	return url;
}
var die=function() {
	console.log.apply(this,arguments)
	process.exit(1);
}

if (!appname) die('node scaffold newappname template --overwrite');
if (!fs.existsSync(appname)) die('folder not exists');
if (!fs.existsSync(appname+'/.git')) die('not a git repository');


var giturl=getgiturl();
if (!forcecreate && fs.existsSync(appname+'/package.json')) {
	die(giturl,'is not a brand new repo, add --overwrite at the end to force create, all files will be overwrite');
}

var walk = function(dir) {
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if (stat && stat.isDirectory()) {
			if (file.substring(file.length-4)!='test') {
				results = results.concat(walk(file))
			} else {
				console.log('skip '+file)
			}
        } 
        else results.push(file)
    })
    return results
}
var mkdirParent = function(dirPath, mode, callback) {
  fs.mkdir(dirPath, mode, function(error) {
    if (error && error.errno === 34) {
      mkdirParent(path.dirname(dirPath), mode, callback);
      mkdirParent(dirPath, mode, callback);
    }
    callback && callback(error);
  });
};

var textext=['.xml','.js','.json','.html','.css','.command','.cmd','.sh','.lst'];
var replaceid=function(source) {
	var raw=fs.readFileSync(source);
	var ext=source.substring(source.lastIndexOf('.'));
	
	if (textext.indexOf(ext)==-1) {
		//console.log('skip non text file',source)
		return raw;
	}
	var raw=fs.readFileSync(source,'utf8');
	var arr=raw.replace(/\r\n/g,'\n').split('\n');
	for (var i in arr) {
		arr[i]=arr[i].replace(/%scaffold%/g,appname);
		if (source.indexOf('package.json')>-1) {
			arr[i]=arr[i].replace(/%git%/g,giturl);
		}
	}
	return arr.join('\n');
}
var copyfile=function(source) {
	if (source.indexOf('%scaffold%')==-1) {
		console.log('not scaffold',source)
		return;
	}
	tobecopied++;
	var stats = fs.lstatSync(source);
	var target=source.replace(templatepath+'%scaffold%',appname);
	var target=target.replace('%scaffold%',appname);

	var targetpath=target;
	var arr=null;
	if (!stats.isDirectory()) {
		arr=replaceid(source);
		targetpath=path.dirname(target);
	}	
	
	mkdirParent(targetpath,function(err){
			tobecopied--;
	 		if (stats.isDirectory()) return;
	 		console.log('create',target)
			fs.writeFileSync(target,arr,'utf8');
			if (target.indexOf('.command')>-1 ||
			    target.indexOf('.sh')>-1){
				fs.chmodSync(target,'0755');
			}
	});
	

	if (stats.isDirectory()) {
		var sourcefiles=walk(source);
		for (var i in sourcefiles) copyfile(sourcefiles[i]);
	}

}

console.log('create scaffold for git',giturl)
var deploy=require('./'+templatepath+'%scaffold%/deploy');
for (var i in deploy) {
	for (var j in deploy[i]) {
		copyfile(templatepath+deploy[i][j]);
	}
}
copyfile(templatepath+'%scaffold%/deploy.json');
//build ydb for user
var timer=setInterval(function(){
	console.log(tobecopied)
	if (tobecopied==0) {
		console.log('build database')
		process.chdir(appname+'/xml/');
		require('./'+appname+'/xml'+'/'+appname);
		process.chdir('../..')
		clearInterval(timer)
		console.log('done');
	}
},100)
