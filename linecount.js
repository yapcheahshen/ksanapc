var fs=require('fs');
var walk = function(dir,ext) {
    var results = []
	if (dir.indexOf('.git')>-1 || dir.substring(dir.length-12)=='node_modules') return results;
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if (stat && stat.isDirectory()) {
			results = results.concat(walk(file))
        } 
        else if (file.substring(file.length-3)=='.js') {
			results.push(file)
		}
    })
    return results
}
var files=walk(process.cwd());
console.log('dir',process.cwd())
var linecount=0;
for (var i in files) {
	linecount+=fs.readFileSync(files[i],'utf8').split('\n').length;
}
console.log('total files',files.length);
console.log('total lines',linecount);