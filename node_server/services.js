/* edit this file to include new services */

var install_services=function( service_holder) {
	require('yadb').api(service_holder); 
	require('yase').api(service_holder); 

}

module.exports=install_services;