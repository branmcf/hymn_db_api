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

var relResID = [];

var answers_categories = [];
var answers_instruments = [];
var answers_ensembles = [];
var answers_shape = [];
var answers_clothing = [];
var answers_ethnicities = [];
var answers_size = [];

var events = [];
var numEvents = 0;

function rowsToJS(theArray) {
  var temp = JSON.stringify(theArray);
  temp = JSON.parse(temp);
  //console.log(temp);
  return temp;
}

function popArray(obj, whichArray) {
  
  obj = JSON.parse(obj);
  

  var theKeys = [];

  if(obj[0] !== undefined) { 
    for(i in obj) {
      theKeys.push(obj[i]);
    }
    whichArray.push(theKeys);    
    return;
  }
  
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var theVal = obj[key];  //the corresponding value to the key:value pair that is either true, false, or a string

      if(key == 'Other' || key == 'other') {
        theKeys.push(obj[key]);
      } else if(theVal == 'True' || theVal == true || theVal == 'true' || theVal == 1) {
        key = key.replace(/_/g, " ");
        //console.log(key);

        theKeys.push(key);
      } else {
        //false, dont add...
        //console.log("false for ", key, ", dont push");         
      }
    } 
  }

  whichArray.push(theKeys);
  //console.log("whichArray: ", whichArray);

}

module.exports.postQuiz = {
	
	handler: function (req, reply) { 
		
		var theData = {
			//type:          req.payload.type,
			text:          req.payload.quiz

		};    

		//theData.text = JSON.stringify(theData.text);

/*
		//question 1
		console.log(theData.text['Which types of song/hymn(s) has your congregation sung in the last 2 months?']);
		console.log("\n\n");
		//question 2
		console.log(theData.text['Select instrumental leadership do you use in worship?'])
		console.log("\n\n");
		console.log(theData.text["What vocal leadership do you use in worship?"])
		console.log("\n\n");
		console.log(theData.text["Which best describes the shape of your worship?"]);
		console.log("\n\n");
		console.log(theData.text["What does your pastor/priest wear when he/she preaches?"]);
		console.log("\n\n");
		console.log(theData.text["What ethnicities/races make up at least 20% of your congregation?"]);
		console.log("\n\n");
		console.log(theData.text["On average, how many people attend your weekly worship services?"]);
*/
		var p = theData.text.categories;
		for (var key in p) {
			if (p.hasOwnProperty(key)) {
				//console.log(key + " -> " + p[key]);
				if(p[key] == true) {
					answers_categories.push(key);
				}
			}
		}
		var p = theData.text.instruments;
		for (var key in p) {
			if (p.hasOwnProperty(key)) {
				//console.log(key + " -> " + p[key]);
				if(p[key] == true) {
					answers_instruments.push(key);
				}
			}
		}
		var p = theData.text.ensembles;
		for (var key in p) {
			if (p.hasOwnProperty(key)) {
				//console.log(key + " -> " + p[key]);
				if(p[key] == true) {
					answers_ensembles.push(key);
				}
			}
		}
		var p = theData.text.shape;
		for (var key in p) {
			if (p.hasOwnProperty(key)) {
				//console.log(key + " -> " + p[key]);
				if(p[key] == true) {
					answers_shape.push(key);
				}
			}
		}
		var p = theData.text.clothing;
		for (var key in p) {
			if (p.hasOwnProperty(key)) {
				//console.log(key + " -> " + p[key]);
				if(p[key] == true) {
					answers_clothing.push(key);
				}
			}
		}
		var p = theData.text.ethnicities;
		for (var key in p) {
			if (p.hasOwnProperty(key)) {
				//console.log(key + " -> " + p[key]);
				if(p[key] == true) {
					answers_ethnicities.push(key);
				}
			}
		}
		var p = theData.text.size;
		for (var key in p) {
			if (p.hasOwnProperty(key)) {
				//console.log(key + " -> " + p[key]);
				if(p[key] == true) {
					answers_size.push(key);
				}
			}
		}

		//console.log("answers_size: ", answers_size, "\nanswers_ethnicities: ", answers_ethnicities);
		
		connection.query(`SELECT id, 
		categories, accompaniment, ensembles, ethnicities, instruments 
		from resources`, function(err, rows, fields) {
			if (err) { 
				return reply(Boom.badRequest()); 
			}
			else {
				var JSObj = rowsToJS(rows);
				resources = JSObj;
				numRes = resources.length;
				
				//loop thru each resource			
				for(var i=0; i < JSObj.length; i++) { 
					var temp = JSON.parse(JSObj[i].categories);
					//console.log(JSObj[i].id, ": ", temp);
					if(temp == null) { continue; }

					//loop thru each item within each resource
						//categories, accompaniment, ensembles, ethnicities, instruments
					for (var key in temp) {
						if (temp.hasOwnProperty(key)) {							
							if(temp[key] == true) {
								for( var j in answers_categories) {
									if(key == answers_categories[j]) {
										relResID.push(JSObj[i].id)
									}
								}															
							}
						}
					}
					var temp = JSON.parse(JSObj[i].instruments);
					//console.log(JSObj[i].id, ": ", temp);
					if(temp == null) { continue; }

					//loop thru each item within each resource
						//instruments, accompaniment, ensembles, ethnicities, instruments
					for (var key in temp) {
						if (temp.hasOwnProperty(key)) {							
							if(temp[key] == true) {
								for( var j in answers_instruments) {
									if(key == answers_instruments[j]) {
										relResID.push(JSObj[i].id)
									}
								}															
							}
						}
					}
					var temp = JSON.parse(JSObj[i].ensembles);
					//console.log(JSObj[i].id, ": ", temp);
					if(temp == null) { continue; }

					//loop thru each item within each resource
						//ensembles, accompaniment, ensembles, ethnicities, ensembles
					for (var key in temp) {
						if (temp.hasOwnProperty(key)) {							
							if(temp[key] == true) {
								for( var j in answers_ensembles) {
									if(key == answers_ensembles[j]) {
										relResID.push(JSObj[i].id)
									}
								}															
							}
						}
					}
					var temp = JSON.parse(JSObj[i].ethnicities);
					//console.log(JSObj[i].id, ": ", temp);
					if(temp == null) { continue; }

					//loop thru each item within each resource
						//ethnicities, accompaniment, ensembles, ethnicities, ethnicities
					for (var key in temp) {
						if (temp.hasOwnProperty(key)) {							
							if(temp[key] == true) {
								for( var j in answers_ethnicities) {
									if(key == answers_ethnicities[j]) {
										relResID.push(JSObj[i].id)
									}
								}															
							}
						}
					}

				
			
		
				}//end for (resources)

				//console.log("relResID: ", relResID);
				
				return reply("ok");
		
			}

	});


	}//end handler
}

