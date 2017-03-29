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

var resources = [];
var numRes = 0;
  //var resTypes = [];
  var resCategories, resCategories_all = [];
  var resTopics, resTopics_all =[];
  var resAcc, resAcc_all = [];
  var resLanguages, resLanguages_all = [];
  var resTags, resTags_all = [];
  var resEnsembles, resEnsembles_all = [];
  var resEth, resEth_all = [];
  var resDenominations, resDenominations_all = [];
  var resInstruments, resInstruments_all = [];


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

};

function formatResource(actualIndex) {
  var resourceData = {};

  resourceData = {
    id:             resources[actualIndex].id,
    title:          resources[actualIndex].name,
    type:           resources[actualIndex].type,
    url:            resources[actualIndex].website,
    author:         resources[actualIndex].author,
    resource_date:  resources[actualIndex].resource_date,
    description:    resources[actualIndex].description,
    parent:         resources[actualIndex].parent,
    is_active:      resources[actualIndex].is_active,
    high_level:     resources[actualIndex].high_level,
    city:           resources[actualIndex].city,
    state:          resources[actualIndex].state,
    country:        resources[actualIndex].country,
    hymn_soc_member:resources[actualIndex].hymn_soc_member,
    is_free:        resources[actualIndex].is_free,
    user_id:        resources[actualIndex].user_id,
    user:           resources[actualIndex].user,
    pract_schol:    resources[actualIndex].pract_schol,
    approved:       resources[actualIndex].approved,
/*
    languages:      resources[actualIndex].languages,
    ethnicities:    resources[actualIndex].ethnicities,
    ensembles:      resources[actualIndex].ensembles,
    categories:     resources[actualIndex].categories,
    accompaniment: 	resources[actualIndex].accompaniment,
    topics:         resources[actualIndex].topics,
    tags:           resources[actualIndex].tags,
    denominations:  resources[actualIndex].denominations,
    instruments:    resources[actualIndex].instruments
*/
    ethnicities:    resEth_all[0][actualIndex],
    ensembles:      resEnsembles_all[0][actualIndex],
    categories:     resCategories_all[0][actualIndex],
    instruments:    resInstruments_all[0][actualIndex]


  };

  resourceData.is_active = reformatTinyInt(resourceData.is_active, false);
  resourceData.high_level = reformatTinyInt(resourceData.high_level, false);
  resourceData.hymn_soc_member = reformatTinyInt(resourceData.hymn_soc_member, false);
  resourceData.is_free = reformatTinyInt(resourceData.is_free, false);
  resourceData.pract_schol = reformatTinyInt(resourceData.pract_schol, true);
  resourceData.approved = reformatTinyInt(resourceData.approved, false);

  //format 
  /*
  resourceData.ethnicities = JSON.parse(resourceData.ethnicities);
  resourceData.tags = JSON.parse(resourceData.tags);
  resourceData.topics = JSON.parse(resourceData.topics);
  resourceData.languages = JSON.parse(resourceData.languages);
  resourceData.ensembles = JSON.parse(resourceData.ensembles);
  resourceData.accompaniment = JSON.parse(resourceData.accompaniment);
  resourceData.categories = JSON.parse(resourceData.categories);
  */
  //end formatting

  var theUrl = "/resource/" + String(resources[actualIndex].id);

  var finalObj = {
    url: theUrl,
    data: resourceData
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
		
		relResID = [];

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
					for (var key2 in temp) {
						if (temp.hasOwnProperty(key2)) {							
							if(temp[key2] == true) {
								for( var j in answers_instruments) {
									if(key2 == answers_instruments[j]) {
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
					for (var key3 in temp) {
						if (temp.hasOwnProperty(key3)) {							
							if(temp[key3] == true) {
								for( var j in answers_ensembles) {
									if(key3 == answers_ensembles[j]) {
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
					for (var key4 in temp) {
						if (temp.hasOwnProperty(key4)) {							
							if(temp[key4] == true) {
								for( var j in answers_ethnicities) {
									if(key4 == answers_ethnicities[j]) {
										relResID.push(JSObj[i].id)
									}
								}															
							}
						}
					}

				
			
		
				}//end for (resources)

				console.log("relResID: ", relResID, "\n\n\n");

				//now we have relResID filled, loop thru and find the most frequent occurances
				var resID_freq = {};
				var resID_array = [];
				var temp = 0;
				for(a1 in relResID) {
					if(a1 == 0) {
						//initialize first one
						temp = relResID[0];
						resID_freq[temp] = 1;
						resID_array.push(temp);
					} else {
						//if you find a new resourceID
						if(relResID[a1] !== resID_freq[temp]) {
							temp = relResID[a1];
							resID_freq[temp] = 1; //add to object
							resID_array.push(temp);
						} else {
							//found the same one, increment...
							resID_freq[temp] = resID_freq[temp] + 1;
						}


					}
					

				}//done looping thru

				//console.log("array: ", resID_freq);

				//find top 5 in resID_freq
				/*
				var top_5_array = [];
				var top1, top2, top3, top4, top5 = 0;

				for( var i in resID_freq) {
					if (resID_freq.hasOwnProperty(i)) {							
						if(top1 < resID_freq[i])	{
							top1 = resID_freq[i];
							
						}													
					}
				}
				*/

				//for now: just use resID_freq...
				var toUse = [];
				for(var k in resID_freq) {
					toUse.push(k);
					if(k >= 4) {
						break;
					}
				}

				connection.query(`SELECT * from resources`, function(err, rows, fields) {
					if (err) { return reply(Boom.badRequest()); }

					var JSObj = rowsToJS(rows);
					//var JSObj = rows;

					resources = [];
					//resTypes = [];
					resCategories = [];
					resTopics =[];
					resAcc = [];
					resLanguages = [];
					resTags = [];
					resEnsembles = [];
					resEth = [];
					resDenominations = [];
					resInstruments = [];

					resources = JSObj;
					numRes = resources.length;

					for(var i=0; i < JSObj.length; i++) { 
						popArray(JSObj[i]["ethnicities"], resEth);
						popArray(JSObj[i]["categories"], resCategories);
						popArray(JSObj[i]["ensembles"], resEnsembles);
						popArray(JSObj[i]["instruments"], resInstruments);

						resEth_all.push(resEth);
						resCategories_all.push(resCategories);
						resEnsembles_all.push(resEnsembles);
						resInstruments_all.push(resInstruments);

					}

					//if no ID specified
					var objToReturn = [];

					for(var i=0; i < resources.length; i++) {
						//var bob = formatResource(i);
						if(resources[i].approved == 1) {
							for(var k in toUse) {
								if(resources[i].id == toUse[k]) {
									var str = formatResource(i);
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

