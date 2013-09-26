ksanapc
=======

A framework for offline PC application based on node-webkit, Backbone Aura, Twitter Bootstrap, and Yase. The application can be run on web server too.

### Installation

create a new folder 
unzip the archive in that folder
( or git clone https://github.com/yapcheahshen/ksanapc.git )

	npm install yadb yase refinery

to run as server mode

	npm install socket.io

install node-webkit in node_webkit subfolder

### Folder Structure
#### node_webkit/jslib
third party javascript library, e.g, jQuery , Backbone, require.js, "require" are replaced to "requirejs" to avoid name conflict.
#### node_webkit/css
bootstrap twitter and other public css
#### node_webkit/auraext
Backbone Aura extensions and common widgets
#### node_server
the web server

####ydb
default folder for ydb data file
	
### ydb search sequence
* current folder  
* other folder    // for testing ydb
* ydb folder      // for public release ydb

### build-in sample
 ydbexplorer, A sample application to explore the content of ydb

### other sample
 slotfilter, Yase sample,  https://github.com/yapcheahshen/slotfilter
### run with node-webkit
 	cd slotfilter
 	run
 	

### run on webserver
	cd node_server
	node server
	start http://127.0.0.1:2555/ydbexplorer/
	
	
### Online tutorial in Chinese
http://www.ksana.tw/ksanapc

### deploying
	node makezip [appname]
create a zip for deploying, including node-webkit runtime, which could be run on PC without git and node.js pre-installed.

### scaffolding
create a repo on github, and clone onto ksanapc folder,
for example: https://github.com/user/myrepo

	node scaffold myrepo

scaffold.js will copy files from %scaffold% and replace id string inside the files.
