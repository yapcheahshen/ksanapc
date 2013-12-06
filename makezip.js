/*
	create stand-alone deployable zip, without any dependency.
*/
var fs=require('fs');
var app=process.argv.slice(2);
var appname=process.argv[2] ||'ksanapc';
var date =new Date().toISOString().substring(0,10);
var shellscript={
	'win32':'.cmd',
	'darwin':'.command',
	'linux':'.sh'
}
var eol={
	'win32':'\r\n',
	'darwin':'\n',
	'linux':'\r'
}
var platform=process.platform;

if (shellscript[app[app.length-1]]) {
	platform=app[app.length-1];
	app.pop();
}

var zipname=appname +'-'+platform+'-'+date+'.zip';
if (appname!="ksanapc") zipname=appname+'/'+zipname;
var shellscriptname='start-'+appname + shellscript[platform];

var ZipWriter = require("./zipwriter").ZipWriter;
var zip = new ZipWriter();
var starttime=new Date();
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
var addfile=function(f) {
	if (f.indexOf(".git")>-1 || f.indexOf(".bak")>-1  || f.indexOf(".log")>-1) {
//		console.log('skip',f);
		return;
	}
	console.log('add ',f);
	zip.addFile(f,f);
}
var addtozip=function(files) {
	for (var i in files) {
		var file=files[i];
		if (!fs.existsSync(file)) throw 'not exist '+file;

		var stats=fs.lstatSync(file);
		if (stats.isDirectory()) {
			var folderfiles=walk(file);
			for (var j in folderfiles) {
				addfile(folderfiles[j]);
			}
		} else {
			addfile(file);
		}
	}
}
var addapp=function(deploy) {
	addtozip(deploy.files);
	addtozip(deploy[platform]);
}

addapp(require('./deploy.json')); // ksanapc
/*
  change package.json to "main": "../../cst/index.html",
  and put in node-webkit exe folder
*/
var addshellscript=function() {
	var script=[], P=platform;
	if ('win32'==P) {
		script.push('start node_webkit\\win-ia32\\nw.exe --remote-debugging-port=9222 '+appname);
	} else if ('darwin'==P) {
		script.push('cd "$(dirname "$0")"');
		script.push('./node_webkit/osx-ia32/node-webkit.app/Contents/MacOS/node-webkit --remote-debugging-port=9222 '+appname);
	} else if ('linux'==P) {
		script.push('cd "$(dirname "$0")"');
		script.push('./node_webkit/linux-ia32/nw --remote-debugging-port=9222 '+appname);
	} else throw 'unsupported platform';

	fs.writeFileSync(shellscriptname,script.join(eol[platform]),'ascii');
	zip.addFile(shellscriptname,shellscriptname);
}

if (appname!='ksanapc') addshellscript();
for (var i in app) {
	var deploy=require('./'+app[i]+'/deploy.json');
	addapp(deploy);
}

//create 
console.log("");
console.log('.....Creating Zip file.....')
zip.saveAs(zipname,function() {
   console.log('time elapsed in seconds', Math.round(new Date()-starttime)/1000);
   console.log("zip file created: ");
   console.log(zipname);
   if (fs.existsSync(shellscriptname)) {
   		fs.unlink(shellscriptname);
   }
});


