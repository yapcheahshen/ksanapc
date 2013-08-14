/* edit this file to include new services */

var install_services=function( service_holder) {
//	require('./api_hello')(service_holder);  
	
	//require('./api_converter')(service_holder); //generic converter 
	//require('./api_launcher')(service_holder); //launcher
	require('yadb').api(service_holder); 
	require('yase').api(service_holder); 
	//require('./api_yadm')(service_holder); 
	//require('./api_yadm4')(service_holder); 
	
	//require('./api_dirty')(service_holder);
	//require('../ksanadb/api_indexer')(service_holder);  
}

module.exports=install_services;