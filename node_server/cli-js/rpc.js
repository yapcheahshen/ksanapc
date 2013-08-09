/*
	this is for browser, a simple wrapper for socket.io rpc
	
	for each call to server, create a unique id
	when server return, get the slot by unique id, and invoke callbacks.
*/
define(function(){
  function GUID () {
    var S4 = function ()    {    return Math.floor(        Math.random() * 0x10000  ).toString(16);  };
    return (   S4() + S4() + "-" + S4() + "-" +  S4() + "-" + S4() + "-" +S4() + S4() + S4()    );
  }

	var RPCs={}; //*  key: unique calling id  */
	
	var socket = io.connect(window.location.host);
  
	var returnfromserver=function(res) {
		var slot=RPCs[res.fid];
		
		if (!slot) {
			throw "invalid fid "+res.fid;
			return;
		}
		
		if (res.success) {
			if (slot.successCB)  slot.successCB(res.err,res.response);
		} else {
			if (slot.errorCB)  slot.errorCB(res.err,res.response);
		}
		delete RPCs[res.fid]; //drop the slot
	}
 
var pchost={
  exec: function(successCB, errorCB, service, action, params) {
	var fid=GUID();
	//create a slot to hold
	var slot={  fid:fid, successCB:successCB, errorCB:errorCB ,params:params, action:action, service:service};
	RPCs[fid]=slot;
	socket.emit('rpc',  { service: service, action:action, params: params , fid:fid });
  }
}
  
  socket.on( 'rpc', returnfromserver );	 
  window.host=pchost;
  return pchost;
});