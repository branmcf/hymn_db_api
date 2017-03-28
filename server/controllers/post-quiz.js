var Hapi = require('hapi');
var Bcrypt = require('bcryptjs');
var Boom = require('boom');
var Joi = require('joi');
var mysql = require('mysql');
var async = require('async');
const fs = require('fs');
var BasicAuth = require('hapi-auth-basic')
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

connection.connect();

function insertQuiz(theObj, callback) {

	
}

function rowsToJS(theArray) {
  var temp = JSON.stringify(theArray);
  temp = JSON.parse(temp);
  //console.log(temp);
  return temp;
}

module.exports.postQuiz = {
	
	handler: function (req, reply) { 
		
		var theData = {
			user_id:       req.payload.uid,
			//type:          req.payload.type,
			text:          req.payload.quiz,

		};    

		//var justQuiz = JSON.stringify(theData);
		theData.text = JSON.stringify(theData.text);
		
		var query = connection.query(`INSERT INTO user_quizzes set ?`, [theData], function(err, rows, fields) {
			if(err) { 
				//console.log(query.sql);	
				//console.log(theData);
				return reply(Boom.badRequest("Error inserting into user_quizzes")); 
			}
		
			//var JSObj = rowsToJS(justQuiz);
			return reply(theData);

		});


	}
}

