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

var relEventID = [];

var answers_categories = [];
var answers_instruments = [];
var answers_ensembles = [];
var answers_shape = [];
var answers_clothing = [];
var answers_ethnicities = [];
var answers_size = [];

var events = [];
var numEvents = 0;
  //var eventTypes = [];
  var eventCategories, eventCategories_all = [];
  var eventTopics, eventTopics_all =[];
  var eventAcc, eventAcc_all = [];
  var eventLanguages, eventLanguages_all = [];
  var eventTags, eventTags_all = [];
  var eventEnsembles, eventEnsembles_all = [];
  var eventEth, eventEth_all = [];
  var eventDenominations, eventDenominations_all = [];
  var eventInstruments, eventInstruments_all = [];


function rowsToJS(theArray) {
  var temp = JSON.stringify(theArray);
  temp = JSON.parse(temp);
  //console.log(temp);
  return temp;
}

function popArray(obj, whichArray) {
  
  obj = JSON.parse(obj);
  if(obj == null ) { 
    whichArray.push([]);
    return; 
  }

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
      var theVal = obj[key];  //the corEventponding value to the key:value pair that is either true, false, or a string

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

};

function formatevent(actualIndex) {
  var eventData = {};

  eventData = {
    id:             events[actualIndex].id,
    title:          events[actualIndex].name,
    type:           events[actualIndex].type,
    url:            events[actualIndex].website,
    author:         events[actualIndex].author,
    event_date:  events[actualIndex].event_date,
    description:    events[actualIndex].description,
    parent:         events[actualIndex].parent,
    is_active:      events[actualIndex].is_active,
    high_level:     events[actualIndex].high_level,
    city:           events[actualIndex].city,
    state:          events[actualIndex].state,
    country:        events[actualIndex].country,
    hymn_soc_member:events[actualIndex].hymn_soc_member,
    is_free:        events[actualIndex].is_free,
    user_id:        events[actualIndex].user_id,
    user:           events[actualIndex].user,
    pract_schol:    events[actualIndex].pract_schol,
    approved:       events[actualIndex].approved,
/*
    languages:      events[actualIndex].languages,
    ethnicities:    events[actualIndex].ethnicities,
    ensembles:      events[actualIndex].ensembles,
    categories:     events[actualIndex].categories,
    accompaniment: 	events[actualIndex].accompaniment,
    topics:         events[actualIndex].topics,
    tags:           events[actualIndex].tags,
    denominations:  events[actualIndex].denominations,
    instruments:    events[actualIndex].instruments
*/
    ethnicities:    eventEth_all[0][actualIndex],
    ensembles:      eventEnsembles_all[0][actualIndex],
    categories:     eventCategories_all[0][actualIndex],
    instruments:    eventInstruments_all[0][actualIndex]


  };

  eventData.is_active = reformatTinyInt(eventData.is_active, false);
  eventData.high_level = reformatTinyInt(eventData.high_level, false);
  eventData.hymn_soc_member = reformatTinyInt(eventData.hymn_soc_member, false);
  eventData.is_free = reformatTinyInt(eventData.is_free, false);
  eventData.pract_schol = reformatTinyInt(eventData.pract_schol, true);
  eventData.approved = reformatTinyInt(eventData.approved, false);

  //format 
  /*
  eventData.ethnicities = JSON.parse(eventData.ethnicities);
  eventData.tags = JSON.parse(eventData.tags);
  eventData.topics = JSON.parse(eventData.topics);
  eventData.languages = JSON.parse(eventData.languages);
  eventData.ensembles = JSON.parse(eventData.ensembles);
  eventData.accompaniment = JSON.parse(eventData.accompaniment);
  eventData.categories = JSON.parse(eventData.categories);
  */
  //end formatting

  var theUrl = "/event/" + String(events[actualIndex].id);

  var finalObj = {
    url: theUrl,
    data: eventData
  };

  //var str = JSON.stringify(finalObj);

  return finalObj;

};

function reformatTinyInt(toFormat, pract_schol) {
  if(toFormat == 1) {
    return("true");
  } else if(toFormat == 0) {
    return("false");
  } else if(pract_schol) {
    return("both");
  } else {
    return("Partially");
  }
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
		var p = null;
		p = theData.text.categories;
		for (var key in p) {
			if (p.hasOwnProperty(key)) {
				//console.log(key + " -> " + p[key]);
				if(p[key] == true) {
					answers_categories.push(key);
				}
			}
		}
		p = theData.text.instruments;
		for (var key in p) {
			if (p.hasOwnProperty(key)) {
				//console.log(key + " -> " + p[key]);
				if(p[key] == true) {
					answers_instruments.push(key);
				}
			}
		}
		p = theData.text.ensembles;
		for (var key in p) {
			if (p.hasOwnProperty(key)) {
				//console.log(key + " -> " + p[key]);
				if(p[key] == true) {
					answers_ensembles.push(key);
				}
			}
		}
		
		p = theData.text.ethnicities;
		for (var key in p) {
			if (p.hasOwnProperty(key)) {
				//console.log(key + " -> " + p[key]);
				if(p[key] == true) {
					answers_ethnicities.push(key);
				}
			}
		}
		

		//console.log("answers_size: ", answers_size, "\nanswers_ethnicities: ", answers_ethnicities);
		
		relEventID = [];

		connection.query(`SELECT id, 
		categories, accompaniment, ensembles, ethnicities, instruments 
		from events`, function(err, rows, fields) {
			if (err) { 
				return reply(Boom.badRequest()); 
			}
			else {
				var JSObj = rowsToJS(rows);
				events = JSObj;
				numEvents = events.length;
				
				//loop thru each event			
				for(var i=0; i < JSObj.length; i++) { 
					var temp = JSON.parse(JSObj[i].categories);
					//console.log(JSObj[i].id, ": ", temp);
					if(temp == null) { continue; }

					//loop thru each item within each event
						//categories, accompaniment, ensembles, ethnicities, instruments
					for (var key in temp) {
						if (temp.hasOwnProperty(key)) {							
							if(temp[key] == true) {
								for( var j in answers_categories) {
									if(key == answers_categories[j]) {
										relEventID.push(JSObj[i].id)
									}
								}															
							}
						}
					}
					var temp = JSON.parse(JSObj[i].instruments);
					//console.log(JSObj[i].id, ": ", temp);
					if(temp == null) { continue; }

					//loop thru each item within each event
						//instruments, accompaniment, ensembles, ethnicities, instruments
					for (var key2 in temp) {
						if (temp.hasOwnProperty(key2)) {							
							if(temp[key2] == true) {
								for( var j in answers_instruments) {
									if(key2 == answers_instruments[j]) {
										relEventID.push(JSObj[i].id)
									}
								}															
							}
						}
					}
					var temp = JSON.parse(JSObj[i].ensembles);
					//console.log(JSObj[i].id, ": ", temp);
					if(temp == null) { continue; }

					//loop thru each item within each event
						//ensembles, accompaniment, ensembles, ethnicities, ensembles
					for (var key3 in temp) {
						if (temp.hasOwnProperty(key3)) {							
							if(temp[key3] == true) {
								for( var j in answers_ensembles) {
									if(key3 == answers_ensembles[j]) {
										relEventID.push(JSObj[i].id)
									}
								}															
							}
						}
					}
					var temp = JSON.parse(JSObj[i].ethnicities);
					//console.log(JSObj[i].id, ": ", temp);
					if(temp == null) { continue; }

					//loop thru each item within each event
						//ethnicities, accompaniment, ensembles, ethnicities, ethnicities
					for (var key4 in temp) {
						if (temp.hasOwnProperty(key4)) {							
							if(temp[key4] == true) {
								for( var j in answers_ethnicities) {
									if(key4 == answers_ethnicities[j]) {
										relEventID.push(JSObj[i].id)
									}
								}															
							}
						}
					}

				
			
		
				}//end for (events)

				console.log("relEventID: ", relEventID, "\n\n\n");

				//now we have relEventID filled, loop thru and find the most frequent occurances
				var eventID_freq = {};
				var eventID_array = [];
				var temp = 0;
				for(a1 in relEventID) {
					if(a1 == 0) {
						//initialize first one
						temp = relEventID[0];
						EventID_freq[temp] = 1;
						EventID_array.push(temp);
					} else {
						//if you find a new eventID
						if(relEventID[a1] !== eventID_freq[temp]) {
							temp = relEventID[a1];
							EventID_freq[temp] = 1; //add to object
							EventID_array.push(temp);
						} else {
							//found the same one, increment...
							EventID_freq[temp] = eventID_freq[temp] + 1;
						}


					}
					

				}//done looping thru

				//console.log("array: ", eventID_freq);

				//find top 5 in eventID_freq
				/*
				var top_5_array = [];
				var top1, top2, top3, top4, top5 = 0;

				for( var i in eventID_freq) {
					if (EventID_freq.hasOwnProperty(i)) {							
						if(top1 < eventID_freq[i])	{
							top1 = eventID_freq[i];
							
						}													
					}
				}
				*/

				//for now: just use eventID_freq...
				var toUse = [];
				for(var k in eventID_freq) {
					toUse.push(k);
					if(k >= 4) {
						break;
					}
				}

				connection.query(`SELECT * from events`, function(err, rows, fields) {
					if (err) { return reply(Boom.badRequest()); }

					var JSObj = rowsToJS(rows);
					//var JSObj = rows;

					events = [];
					//EventTypes = [];
					EventCategories = [];
					EventTopics =[];
					EventAcc = [];
					EventLanguages = [];
					EventTags = [];
					EventEnsembles = [];
					EventEth = [];
					EventDenominations = [];
					EventInstruments = [];

					events = JSObj;
					numEvents = events.length;

					for(var i=0; i < JSObj.length; i++) { 
						popArray(JSObj[i]["ethnicities"], eventEth);
						popArray(JSObj[i]["categories"], eventCategories);
						popArray(JSObj[i]["ensembles"], eventEnsembles);
						popArray(JSObj[i]["instruments"], eventInstruments);

						EventEth_all.push(EventEth);
						EventCategories_all.push(EventCategories);
						EventEnsembles_all.push(EventEnsembles);
						EventInstruments_all.push(EventInstruments);

					}

					//if no ID specified
					var objToReturn = [];

					for(var i=0; i < events.length; i++) {
						//var bob = formatevent(i);
						if(events[i].approved == 1) {
							for(var k in toUse) {
								if(events[i].id == toUse[k]) {
									var str = formatevent(i);
									objToReturn.push(str);
								}
							}
							
							
						}
					}//end for

					if(objToReturn.length <= 0) {
						return reply(Boom.badRequest("nothing to return, nothing is approved"));
					} else {
						reply(objToReturn);
					}  
					
				
				});
		
			}

	});


	}//end handler
};

