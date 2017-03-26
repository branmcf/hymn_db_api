var Hapi = require('hapi');
var Bcrypt = require('bcryptjs');
var Boom = require('boom');
var Joi = require('joi');
var mysql = require('mysql');
var async = require('async');
const fs = require('fs');
var BasicAuth = require('hapi-auth-basic')
var options = require('../../config/config.js');

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

//to be used at the end of the file for exporting the handlers
var quizController = {};
var quizAnswers = [];

var getUserAnswers = function(err, data) {
	
};

//================================================================

//RESOURCE GET REQUEST
quizController.getConfig = {
	/*
	================================================== 
	IMPORTANT: THE ID IS THE ID OF THE USER, NOT THE QUIZ!
	==================================================
	*/
  handler: function (request, reply) {

		if(!request.params.id) {
			connection.query(`SELECT id, JSON_EXTRACT(answers, '$[*]') AS answers FROM users`, (err, rows) => {
				if(err) { return reply(Boom.badRequest("error selecting answers array")); }
				tesquizAnswers = JSON.parse(JSON.stringify(rows));
				AnswersArr = [];
				for(var i = 0; i < tesquizAnswers.length; i++) {			
					tempObj = {
						id: tesquizAnswers[i]["id"],
						answers: tesquizAnswers[i]["answers"]
					}
					AnswersArr.push(tempObj);
				}
				
				//console.log(JSON.stringify(AnswersArr));
				reply(AnswersArr);
			});
		} else {
			connection.query(`SELECT JSON_EXTRACT(answers, '$[*]') AS answers FROM users WHERE id = ?`, [request.params.id], (err, rows) => {
				if(err) { return reply(Boom.badRequest("error selecting answers array")); }
				tesquizAnswers = JSON.parse(JSON.stringify(rows[0]));												
				
				//console.log(JSON.stringify(AnswersArr));
				reply(tesquizAnswers);
			});
		}
		

  }//end handler
};

module.exports = [
	//{ path: '/quiz', method: 'POST', config: quizController.postConfig },
  	{ path: '/quiz/{id?}', method: 'GET', config: quizController.getConfig }
  	//{ path: '/quiz/{id}', method: 'DELETE', config: quizController.deleteConfig},
  	//{ path: '/quiz/{id}', method: 'PUT', config: quizController.updateConfig}
];