var fs=require('fs');
var argv=process.argv;
var app=argv;
app.shift();app.shift();
var date =new Date().toISOString().substring(0,10);
var appname=(app[0]||'ksanapc');
var zipname='%zip%/'+appname +'-'+process.platform+'-'+date+'.zip';
var shellscript={
	'win32':'.cmd',
	'darwin':'.command',
	'linux':'.sh'
}
var shellscriptname='start-'+appname + shellscript[process.platform];

var ZipWriter = require("./zipwriter").ZipWriter;
var zip = new ZipWriter();

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
	addtozip(deploy[process.platform]);
}

addapp(require('./deploy.json')); // ksanapc

var addscriptscript=function() {
	var script=[], P=process.platform;
	if ('win32'==P) {
		script.push('start node_webkit\\win-ia32\\nw.exe --remote-debugging-port=9222 '+appname);
	} else if ('darwin'==P) {
		script.push('DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"');
		script.push('cd $DIR');
		script.push('./node_webkit/osx-ia32/node-webkit.app/Contents/MacOS/node-webkit --remote-debugging-port=9222 '+appname);
	} else if ('linux'==P) {
		script.push('DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"');
		script.push('cd $DIR');
		script.push('./node_webkit/linux-ia32/nw --remote-debugging-port=9222 '+appname);
	} else throw 'unsupported platform';

	fs.writeFileSync(shellscriptname,script.join(require('os').EOL),'ascii');
	zip.addFile(shellscriptname,shellscriptname);
}

if (appname!='ksanapc') addscriptscript();
for (var i in app) {
	var deploy=require('./'+app[i]+'/deploy.json');
	addapp(deploy);
}
//create 
console.log('SAVING.....')
zip.saveAs(zipname,function() {
   console.log("zip file created: "+zipname);
   if (fs.existsSync(shellscriptname)) {
   		fs.unlink(shellscriptname);
   }
});


