ksanapc
=======

A framework for offline PC application based on node-webkit, Backbone Aura, Twitter Bootstrap, and Yase

### Installation
	create a new folder 
	unzip the archive in that folder
	( or git clone https://github.com/yapcheahshen/ksanapc.git )

	npm install vows // if you need to run  yadb and yase test suite
	npm install yadb
	npm install yase
	install node-webkit in node_webkit subfolder
	
### Folder Structure
	* node_webkit/jslib
	third party javascript library, e.g, jQuery , Backbone, require.js
	* node_webkit/css
	bootstrap twitter and other public css
	* node_webkit/auraext
	Backbone Aura extensions and common widgets

	* ydb
	default folder for ydb data file
	
### ydb search sequence
	* current folder  
	* other folder    // for testing ydb
	* ydb folder      // for public release ydb

### ydbexplorer
	A sample application to explore the content of ydb
