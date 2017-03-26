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

//to be used at the end of the file for exporting the handlers
var quizController = {};
var quizAnswers = [];


module.exports.getAnswers = {

handler: function (request, reply) {

		if(!request.params.id) {
			connection.query(`SELECT id, JSON_EXTRACT(answers, '$[*]') AS answers FROM users`, (err, rows) => {
				if(err) { return reply(Boom.badRequest("error selecting answers array")); }
				quizAnswers = JSON.parse(JSON.stringify(rows));
				AnswersArr = [];
				for(var i = 0; i < quizAnswers.length; i++) {			
					tempObj = {
						id: quizAnswers[i]["id"],
						answers: quizAnswers[i]["answers"]
					}
					AnswersArr.push(tempObj);
				}
				
				//console.log(JSON.stringify(AnswersArr));
				reply(AnswersArr);
			});
		} else {
			connection.query(`SELECT JSON_EXTRACT(answers, '$[*]') AS answers FROM users WHERE id = ?`, [request.params.id], (err, rows) => {
				if(err) { return reply(Boom.badRequest("error selecting answers array")); }
				quizAnswers = JSON.parse(JSON.stringify(rows[0]));												
				//console.log(JSON.stringify(quizAnswers));
				var answers_array = JSON.parse(quizAnswers["answers"]);
				if(answers_array.length > 0) {

					/*
					connection.query(`SELECT choice_text FROM choices WHERE choice_id = ?`, [answers_array[0]], (err, rows) => {
						if(err) { return reply(Boom.badRequest("error querying choices.choice_text")); }
						console.log("CHOICE_TEXT: ", rows[0]);
					});
					*/
					var rowCollection = [];

					var Select = 'SELECT choice_text ';
					var From = 'FROM `choices` ';
					var Where = 'WHERE `choice_id` = ?';
					var sql = Select + From + Where;
					async.forEachOf(answers_array, function (AAElement, i, inner_callback){						
						var inserts = AAElement;
						var ssql = mysql.format(sql, inserts);
						//AAElement[i] = i;
						connection.query(ssql, function(err, rows, fields){
								if(!err){
										rowCollection.push (rows[0]["choice_text"]);
										console.log("ROW["+ i +"]: " + JSON.stringify(rows[0]["choice_text"]));
										//AAElement['undercut'] = rows[0].choice_text;
										inner_callback(null);
								} else {
										console.log("Error while performing Query");
										inner_callback(err);
								};
						});
					}, function(err){
							if(err){
								return reply(Boom.badRequest("error querying choices.choice_text"));
							}else{
								//after all the iterations are done, return the collection of all those rows
								console.log("=>\n", rowCollection);
								return reply(rowCollection);
							}
					});

				}
				//reply(quizAnswers);
			});
			
		}//end else
		

  }//end handler


}