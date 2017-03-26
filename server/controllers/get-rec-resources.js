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
var answers_array = []; //contains choice_id's, NOT TEXT

var answer_resID_dict = {};

function rowsToJS(theArray) {
  var temp = JSON.stringify(theArray);
  temp = JSON.parse(temp);
  //console.log(temp);
  return temp;
}


function populateDictionary(rows, callback) {
	// ^ rows: rows containing id, tags of APPROVED resources
	//loop thru each resource
	for(var i=0; i<rows.length; i++) { 
		tag_array = JSON.parse(rows[i].tags);
		//loop thru each tag within each resource
		for(var j=0; j < tag_array.length; j++) {
			//loop thru each answer_text to see if there is a match 
			for(k in Object.keys(answer_resID_dict)) {
				//convert to lowercase
				var temp_answer = Object.keys(answer_resID_dict)[k].toLowerCase();
				var temp_tag = tag_array[j].toLowerCase();;
				//console.log("\nDoes ", temp_answer, " match ", temp_tag, " ?");
				//if(Object.keys(answer_resID_dict)[k] == tag_array[j]) {		
				if(temp_answer == temp_tag)	 {		
					console.log("found a match!");
					//NOW, for the corresponding user specific answer dictionary, add the resource ID
					answer_resID_dict[Object.keys(answer_resID_dict)[k]].push(rows[i].id);
					console.log("now= ", answer_resID_dict[Object.keys(answer_resID_dict)[k]]);
				} else {
					//console.log("no...");
				}
			}
		}
		if(i == rows.length -1) { console.log("end of populateDictionary"); }
	}
	callback();
	
};

function getBestMatches() {
	//now for the 3rd step, getting the best matching resources based on the user's answers
}

module.exports.getRecRes = {

	handler: function (request, reply) { 

		if(!request.params.id) { return reply(Boom.badRequest("Need to include (user) ID")); }

		connection.query(`SELECT JSON_EXTRACT(answers, '$[*]') AS answers FROM users WHERE id = ?`, [request.params.id], (err, rows) => {
			if(err) { return reply(Boom.badRequest("error selecting answers array")); }
			quizAnswers = JSON.parse(JSON.stringify(rows[0]));												
			//console.log(JSON.stringify(quizAnswers));
			answers_array = JSON.parse(quizAnswers["answers"]);

			if(rows[0].answers == null) { return reply(Boom.badRequest("user has no answers in db")); }

			if(answers_array.length > 0) {

				var choice_txt_collection = []; //CONTAINS CHOICE_TEXT

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
									choice_txt_collection.push (rows[0]["choice_text"]);
									//console.log("ROW["+ i +"]: " + JSON.stringify(rows[0]["choice_text"]));
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
						} else {

							//after all the iterations are done...
								//dynamicall create the answer: resID dictionary							
							for(var i=0; i<choice_txt_collection.length; i++){
								answer_resID_dict[choice_txt_collection[i]] = [];
							}

							/*
							================================================
							NOW GET ALL RESOURCES, THEN SEE IF THEY HAVE MATCHING TAGS WITH THE USER'S ANSWERS
							================================================
							*/
							connection.query(`SELECT id, tags from resources WHERE approved = 1`,function(err, rows, fields) {
								if (!err) {
									var JSObj = rowsToJS(rows);
									populateDictionary(JSObj, getBestMatches);


									return reply("ey");
									//return reply(JSON.parse(rows[0].tags));
									
								} else {
									return reply(Boom.badRequest("bad request when getting resource tags for id=", red_id));
									console.log('Error while performing Resources Query.');
								}
								

							});
						
							//getAppResourcesTags(ThenReply);						

						}
				});

			}
			//reply(quizAnswers);
		});

	}//end handler
};