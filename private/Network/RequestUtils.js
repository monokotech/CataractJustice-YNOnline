
function GetAddress(req) {
	let address = req.headers["x-forwarded-for"];
  	if (address){
    	let list = address.split(",");
    	address = list[list.length-1];
  	} else {
  		address = req.connection.remoteAddress;
  	}
	return address;
}

module.exports = {GetAddress};