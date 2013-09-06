var fs=require('fs');
var http=require('http');
var url = require('url');
var path = require('path');
var restart=require('./restart');//restart helper
var rpc_node=require('./rpc_node');
//var googlelogin=require('./googlelogin');
var googlelogin={};
  
var mimeTypes = {
    "html": "text/html",
	"htm": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "application/javascript",
    "css": "text/css"};
	
var spawn = require('child_process').spawn;
var argv=process.argv;

var port=argv[3] || "2555";  //default port
var autostart=!!argv[2];
var startfolder=argv[2]||"launcher"; 
var appendhtml=false;
var nocacheforjs=true; //set to false for production server
port=parseInt(port);
process.chdir('..');
function dirExistsSync (d) {
try { return fs.statSync(d).isDirectory() }
  catch (er) { return false }
 }
 var forcerestart=function(res) {
	fs.writeFileSync(__dirname+'\\restart.js',"var a=null;");
	res.statusCode = 302;
	console.log('redirect to '+startfolder);
	res.setHeader("Location", "/"+startfolder+"/");
	res.end();
	return;
 }
 
var servestatic=function(filename,stat,req,res) {
	var etag = stat.size + '-' + Date.parse(stat.mtime);

	
	if(req.headers['if-none-match'] === etag) {
		res.statusCode = 304;
		res.end();
	} else {
		var ext=filename.substring(filename.lastIndexOf("."));
		var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
		if (nocacheforjs && (ext=='.js' || ext=='.tmpl')) {
			console.log('serving no cache file '+filename);
			res.writeHead(200, {'Content-Type':
			mimeType,'Content-Length':stat.size	} );
		} else {
			console.log('serving file '+filename);
			res.writeHead(200, {'Content-Type':
			mimeType,'Content-Length':stat.size ,'Last-Modified': stat.mtime,
			'ETag': etag} );
		}
		var fileStream = fs.createReadStream(filename);
		fileStream.pipe(res);
	}
}

var startserver=function() {
	
    var httpd=http.createServer(function(req, res) {
		if (req.method=="POST") {
			res.writeHead(200);
			req.on('data', function(chunk) {
			  res.write(chunk);
			});
			 req.on('end', function() {
				
				res.end("ok");
			 });
		}
		var uri = url.parse(req.url).pathname;
		appendhtml=false;
		if (uri[uri.length-1]=='/') {
			uri+='index.html';
			appendhtml=true;
		}
		
		if (req.url=='/quit') {
			process.exit();
		} else if (req.url=='/login') {
			googlelogin.login(req,res);
			return;
		} else if (req.url.substring(0,15)=='/oauth2callback') {
			googlelogin.callback(req,res);
			return;
		} else if (req.url=='/user') {
			console.log('user',googlelogin.googleuser)
			googlelogin.user(req,res,googlelogin.googleuser);
			return;
		} else if (req.url=='/restart') {
			forcerestart(res);
			return;
		}

		var filename = path.join(process.cwd(), uri);
		
		// deal with missing / for foldername
		if (dirExistsSync(filename) && filename[filename.length-1]!='/' && !appendhtml) {
			res.statusCode = 302;
			console.log('redirect to '+uri+"/");
			res.setHeader("Location", uri+"/");
			res.end();
			return;			
		}
		
		fs.stat(filename, function(err,stat) {
			if(!stat) {
				console.log("not exists: " + filename);
				res.writeHead(200, {'Content-Type': 'text/plain'});
				res.write('404 Not Found \n'+filename);
				res.end();
				return;
			}
			servestatic(filename,stat,req,res);
			
 
		}); //end path.exists
	}).listen(port,"127.0.0.1");	
	if (autostart) spawn('cmd', ["/c","start",'http://127.0.0.1:'+port+'/'+startfolder+'/']);
	rpc_node(httpd);  //enable server side API, pass in httpd server handle
}

process.on('uncaughtException', function(err) {
  console.log(err);
  rpc_node.finalize();
});

startserver();
