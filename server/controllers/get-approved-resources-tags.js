var Joi = require('joi');
var mysql = require('mysql');
var Boom = require('boom');
var async = require('async');

var options = require('../config/config.js');

//mysql connection
var connection = mysql.createConnection({
  host     : options.host,
  user     : options.user,
  password : options.password,
  database : options.database,
  port     : options.port

});

if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
}

function rowsToJS(theArray) {
  var temp = JSON.stringify(theArray);
  temp = JSON.parse(temp);
  //console.log(temp);
  return temp;
}

module.exports = function(res_id) {
	connection.query(`SELECT tags, approved from resources WHERE id = ?`, [res_id],function(err, rows, fields) {
    if (!err) {
      var JSObj = rowsToJS(rows);
      
      if(JSObj[0].approved !== 1) { return reply(Boom.badRequest("requesting an UNAPPROVED RESOURCE")); }

      console.log(JSObj[0].tags);
      return(JSObj[0].tags);
          
    }	else {
        return reply(Boom.badRequest("bad request when getting resource tags for id=", red_id));
        console.log('Error while performing Resources Query.');
    }
        

	});



}//end func