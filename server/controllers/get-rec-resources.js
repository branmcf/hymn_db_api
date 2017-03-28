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
var resID_freq_dict = {};

var top_5 = {'1': 0, 
	'2': 0,
	'3': 0,
	'4': 0,
	'5': 0
};	//stores the top 5 resources by mapping resource_ID => frequency

var top_5_array = []; //to be used later to store individual top_5 objects

function rowsToJS(theArray) {
  var temp = JSON.stringify(theArray);
  temp = JSON.parse(temp);
  //console.log(temp);
  return temp;
}


function populateAnswersDictionary(rows, callback) {
	// ^ rows: rows containing id, tags of APPROVED resources
	//loop thru each resource
	for(var i=0; i<rows.length; i++) { 
		tag_array = JSON.parse(rows[i].tags);
		if(tag_array == null) { continue; }
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
		//if(i == rows.length -1) { console.log("end of populateAnswersDictionary"); }
	}
	callback();
	
};

function getBestMatches() {
	//now for the 3rd step, getting the best matching resources based on the user's answers
	// use resID_freq_dict to store resource_id: frequency pairs

	//loop through every element of every array in answer_resID_dict 
		//and create keys for every resource ID, then increment the value for that key when the key is found
		//dict to populate: resID_freq_dict

	//loop thru every key's corresponding value (which is an array of resource_id's)
	for(k in Object.keys(answer_resID_dict)) {
		//var temp_answer = Object.keys(answer_resID_dict)[k].toLowerCase();
		//var res_id = answer_resID_dict[temp_answer];
		var tempKey = Object.keys(answer_resID_dict)[k];

		//loop through every element of the array and create the resID_freq_dict that maps resourceID to frequency
		for(j in answer_resID_dict[tempKey]) {
			if(resID_freq_dict[answer_resID_dict[tempKey][j]] >= 1) {
				console.log("already exists...");				
				resID_freq_dict[answer_resID_dict[tempKey][j]] = resID_freq_dict[answer_resID_dict[tempKey][j]] + 1;
			} else {
				resID_freq_dict[answer_resID_dict[tempKey][j]] = 1;
			}
			
		}
		
		
		//console.log("test this: ", answer_resID_dict[tempKey]);

		
	}
	//now you have a filled resID_freq_dict, mapping resourceID's to frequency
	//console.log("testtt, ", resID_freq_dict);
	//now loop thru resID_freq_dict values, get top 5 numbers

	//first check to see if there are even 5 keys inside resID_freq_dict...
	if(Object.keys(resID_freq_dict).length <= 5) {
		for (var key in resID_freq_dict) {
			if (resID_freq_dict.hasOwnProperty(key)) {
				//console.log(key + " -> " + resID_freq_dict[key]);
				top_5.push(key);
			}
		}
	} else {
		
		top_5_array = []; 

		//below for loop just initializes the top_5_array to the default values of the current top_5 (top of the file)
		for (var top5_key in top_5) {
			if (top_5.hasOwnProperty(top5_key)) { 
				console.log("===ONE ITERATION=== for key: ", key);
				//currentFreq = top_5[top5_key];
				//console.log("[top5_key]: ", top5_key);
				//console.log("top_5[top5_key]: ", top_5[top5_key]);
				//console.log({ [top5_key] : top_5[top5_key]})
				top_5_array.push({ [top5_key] : top_5[top5_key]});
			}
			
		} //top_5_array has been initialized

		//loop thru every VALUE in resID_freq_dict to get the frequency, and check to see if that frequency is higher than an element in the current top_t_array
		for (var key in resID_freq_dict) {
			if (resID_freq_dict.hasOwnProperty(key)) {
				//console.log(key + " -> " + resID_freq_dict[key]);
				var freqNum = resID_freq_dict[key]; //number to check
				
				//now we want to loop through the 5 elements in the top_5 dictionary
				//start by making an array that we'll push all of the top_5 keys:value pairs into
				
				var key1, key2, key3, key4, key5;

				key1 = Object.keys(top_5_array[0]);
				key2 = Object.keys(top_5_array[1]);
				key3 = Object.keys(top_5_array[2]);
				key4 = Object.keys(top_5_array[3]);
				key5 = Object.keys(top_5_array[4]);

				if(freqNum > top_5_array[0][key1]) {
					top_5_array[4] = top_5_array[3]; 	//last element is popped off, replace with 2nd to last element
					top_5_array[3] = top_5_array[2];	//and continue...
					top_5_array[2] = top_5_array[1];
					top_5_array[1] = top_5_array[0];
					top_5_array[0] = {[key]: freqNum};	//store the KEY, not the freNum because top_5 is keeping track
					continue;
				} else if(freqNum > top_5_array[1][key2]) {
					top_5_array[4] = top_5_array[3];
					top_5_array[3] = top_5_array[2];
					top_5_array[2] = top_5_array[1];
					top_5_array[1] = {[key]: freqNum};
					continue;
				} else if(freqNum > top_5_array[2][key3]) {
					top_5_array[4] = top_5_array[3];
					top_5_array[3] = top_5_array[2];
					top_5_array[2] = {[key]: freqNum};
					continue;
				} else if(freqNum > top_5_array[3][key4]) {
					top_5_array[4] = top_5_array[3];
					top_5_array[3] = {[key]: freqNum};
					continue;
				} else if(freqNum > top_5_array[4][key5]) {
					top_5_array[4] = {[key]: freqNum};
					continue;
				} else {
					//do nothing because the number to check is smaller than OR OR EQUAL TO any of those in the top_5 array
				}
			}
		}

		console.log("top_5: ", top_5_array);
	}//end else
	
	

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
							var query = connection.query(`SELECT id, tags from resources WHERE approved = 1`,function(err, rows, fields) {
								if (!err) {
									
									var JSObj = rowsToJS(rows);
									//console.log("Q: ", JSObj);
									populateAnswersDictionary(JSObj, getBestMatches); //first run populateAnswersDictionary(), then getBestMatches()


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