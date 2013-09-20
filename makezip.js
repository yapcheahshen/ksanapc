var fs=require('fs');
var argv=process.argv;
var app=argv;
app.shift();app.shift();
var date =new Date().toISOString().substring(0,10);
var zipname=(app[0]||'ksanapc') +'-'+date+'.zip';

var ZipWriter = require("./zipwriter").ZipWriter;
var zip = new ZipWriter();

var walk = function(dir) {
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if (stat && stat.isDirectory()) results = results.concat(walk(file))
        else results.push(file)
    })
    return results
}
var addfile=function(f) {
	if (f.indexOf(".git")>-1 || f.indexOf(".bak")>-1) return;
	console.log('adding',f);
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

//var AdmZip = new require('adm-zip');
//var zip=new AdmZip();


addapp(require('./deploy.json')); // ksanapc

for (var i in app) {
	var deploy=require('./'+app[i]+'/deploy.json');
	addapp(deploy);
}

//zip.writeZip(zipname);
console.log('SAVING.....')
zip.saveAs(zipname,function() {
   console.log("zip written.");
});


