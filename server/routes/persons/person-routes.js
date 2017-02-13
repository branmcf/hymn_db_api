var Joi = require('joi');
var mysql = require('mysql');
var Boom = require('boom');

var options = require('../../config/config.js');

//mysql connection
var connection = mysql.createConnection({
  host     : options.host,
  user     : options.user,
  password : options.password,
  database : options.database,
  port     : options.port

});




personController = {};
var persons = [];
  var numPersons = 0;
  var personTopics = [];
  var personEnsembles = [];
  var personEthnicities =[];
  var personInstruments = [];
  var personCategories = [];

getPersons();


/*
================================================================================
================================================================================
 - FOR INSERTING INTO PERSONS AND MIDDLE TABLES
================================================================================
================================================================================
*/

function insertPerson(theObj) {

  var justPerson = JSON.parse(JSON.stringify(theObj));

//delete columns not stored in the persons table!
  if(typeof justPerson.topics !== "undefined") { delete justPerson.topics; }
  if(typeof justPerson.ensembles !== "undefined") { delete justPerson.ensembles; }
  if(typeof justPerson.ethnicities !== "undefined") { delete justPerson.ethnicities; }
  if(typeof justPerson.instruments !== "undefined") { delete justPerson.instruments; }
  if(typeof justPerson.categories !== "undefined") { delete justPerson.categories; }


// TYPE CONVERSION
  if(typeof justPerson.hymn_soc_member == "string") {
    if(justPerson.hymn_soc_member == "no" || justPerson.hymn_soc_member == "No") {
      justPerson.hymn_soc_member = false;
    } else {
      justPerson.hymn_soc_member = true;
    }
  } else if(typeof justPerson.hymn_soc_member == "number") {
    if(justPerson.hymn_soc_member == 0) {
      justPerson.hymn_soc_member = false;
    } else {
      justPerson.hymn_soc_member = true;
    }
  } else {
    //neither a string nor Number
    justPerson.hymn_soc_member = false;
  }

  

// END TYPE CONVERSION

	connection.query(`INSERT INTO persons SET ?`, justPerson, function(err, rows, fields) {
        if(err) { throw err; }

        var JSObj = rowsToJS(theObj);

        persons[0].push(JSObj);

        //console.log("ethnicities length: ", Object.keys(theObj.ethnicities).length);

        //console.log("FIRST KEY IN ETHNICITIES: ",Object.keys(theObj.ethnicities)[0]);

        //var ethlength = Object.keys(theObj.ethnicities).length;

      //for multiple ethnicities
      if("ethnicities" in theObj && typeof theObj.ethnicities !== "undefined" && typeof theObj.ethnicities !== "null") {
        for(var i=0; i< Object.keys(theObj.ethnicities).length; i++) {
            getID_left(theObj, i, "Ethnicities", "ethnicity_id");
        }
      }

      if("topics" in theObj && typeof theObj.topics !== "undefined" && typeof theObj.topics !== "null") {
        for(var i=0; i< Object.keys(theObj.topics).length; i++) {
            getID_left(theObj, i, "Topics", "topic_id");
        }
      }

      if("categories" in theObj && typeof theObj.categories !== "undefined" && typeof theObj.categories !== "null") {
        for(var i=0; i< Object.keys(theObj.categories).length; i++) {
            getID_left(theObj, i, "Person_Categories", "person_category_id");
        }
      }

      if("instruments" in theObj && typeof theObj.instruments !== "undefined" && typeof theObj.instruments !== "null") {
        for(var i=0; i< Object.keys(theObj.instruments).length; i++) {
            getID_left(theObj, i, "Instrument_Types", "instrument_type_id");
        }
      }

      if("ensembles" in theObj && typeof theObj.ensembles !== "undefined" && typeof theObj.ensembles !== "null") {
    	  for(var i=0; i< Object.keys(theObj.ensembles).length; i++) {
    		  getID_left(theObj, i, "Ensembles", "ensemble_id");

          if(i == Object.keys(theObj.ensembles).length - 1) {
              getPersons();
          }
    	  }
      } else { getPersons(); }

    });
}

function getID_left(theObj, whichIndex, tableName, left_table_id) {
  //console.log("1: ", tableName );

	switch(tableName) {

		case "Ethnicities":
      checkIfTrue("ethnicities", theObj, whichIndex, tableName, left_table_id);
			break;
		case "Topics":
      checkIfTrue("topics", theObj, whichIndex, tableName, left_table_id);
			break;
		case "Ensembles":
			checkIfTrue("ensembles", theObj, whichIndex, tableName, left_table_id);
			break;
    case "Instrument_Types":
      checkIfTrue("instruments", theObj, whichIndex, tableName, left_table_id);
      break;
    case "Person_Categories":
      checkIfTrue("categories", theObj, whichIndex, tableName, left_table_id);
      break;
		default:
			console.log("INVALID TABLE NAME SENT for ",tableName);
			break;
	}//end switch

}

function checkIfTrue(param1, theObj, whichIndex, tableName, left_table_id) {
  //console.log("2: ", tableName)
  var attributeName2 = Object.keys(theObj[param1])[whichIndex];
  if(attributeName2 == "Other" || attributeName2 == "other") {
      //insert into "other_text" column
      var theOtherText = theObj[param1][attributeName2];

      checkIfExists(theOtherText, tableName, left_table_id, attributeName2);

 } else if(theObj[param1][attributeName2] == false || theObj[param1][attributeName2] == "false") {
     attributeName2 = "false";
     //console.log("False, insert nothing...");

 } else {
    //console.log ("It's True for: ", attributeName2);
    getLeftTableID(tableName, left_table_id, attributeName2);
 }

  //return attributeName2;
}

  function checkIfExists(other_text, tableName, left_table_id, attributeName) {
    //console.log("3: ", tableName);
    var TorF = false;
    var query = connection.query(`SELECT * FROM ${tableName} WHERE other_text = ?`, other_text, function (err, rows) {
  		if(err) { throw new Error(err); return; }

      //console.log(`SELECTED FROM ${tableName}... \n RESULT: `, query.sql);

      if(!rows[0]) {
        TorF = false;
      }
      else {
        TorF = true;
      }

      checkTorF(TorF, other_text, tableName, left_table_id, attributeName);

    });
  }

  function checkTorF(TorF, other_text, tableName, left_table_id, attributeName) {
    //console.log("4: ", tableName);
    if(TorF == false) {
        var toInsert = {
          name: "Other",
          other_text: other_text
        };
        //console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n other_text: ", toInsert.other_text);
        //insert!
        insertIfNotExists(toInsert, tableName, left_table_id, attributeName);

      }//end if
      else {
        var toGet = {
          name: "Other",
          other_text: other_text
        }
        //it exists already
        getLeftTableID(tableName, left_table_id, toGet);
      }

  }

  function insertIfNotExists(toInsert, tableName, left_table_id, attributeName) {
    //console.log("5: ", tableName);

    var query2 = connection.query(`INSERT INTO ${tableName} SET ?`,toInsert, function (err, rows) {
  		if(err) { throw new Error(err); return; }

  		//console.log(`INSERTED OTHER CATEGORY INTO ${tableName}... \nquery: `, query2.sql);

      getLeftTableID(tableName, left_table_id, toInsert);
    });
  }

//
//
//


function getLeftTableID(tableName, left_table_id, attributeName) {

  //console.log("6: ", tableName);
  var mid_table_id = 0;

  if(attributeName !== "false") {
    	//2a
      //NEED TO: if name= Other, then resort to 'other_text'
    if(typeof attributeName == "object") {

      var query = connection.query(`SELECT id FROM ${tableName} WHERE other_text = ?`,
        attributeName.other_text, function (err, rows) {
          if(err) { throw new Error(err); return; }

          //console.log("=========================");
          //console.log(query.sql);
          //console.log("=========================");

          try {
            mid_table_id = rows[0].id;
          } catch (err) {
            // Handle the error here.
            console.log("ERROR WITH RESULT: ", rows);
            console.log("CAUSED BY: ", attributeName, " to be used in ", tableName);
          }
          //console.log("mid_table_id: ",mid_table_id);

          if(mid_table_id != 0) {
            insertMiddle(mid_table_id, tableName, left_table_id);
          } else {
            console.log("ERROR, NO ROW FOUND IN ", tableName, " WITH name = ",attributeName);
          }

        }); //end mysql connection
      } else {
        //if it's not "Other"...

        //if it exists

          var query = connection.query(`SELECT id FROM ${tableName} WHERE name = ?`,
          attributeName, function (err, rows) {
            if(err) { throw new Error(err); return; }

            //console.log("=========================");
            //console.log(query.sql);
            //console.log("=========================")


            if(!rows[0]) {
              //does not exist in db yet...
              createNewAttribute(tableName, attributeName, left_table_id)
            } else {
              //it does exist!
              mid_table_id = rows[0].id;

              insertMiddle(mid_table_id, tableName, left_table_id)
            }

          });

    }//end else (as in, if the attributeName is not == "object")
  }//end if attribute name !== "false"
}

function createNewAttribute(tableName, attributeName, left_table_id) {

  //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\nCREATING NEW ROW IN ", tableName, " for ", attributeName);

  var query = connection.query(`INSERT INTO ${tableName} SET name = ?`,
    attributeName, function (err, rows) {
      if(err) { throw new Error(err); return; }

      getNewAttribute(tableName, attributeName, left_table_id);

  }); //end mysql connection

}

function getNewAttribute(tableName, attributeName, left_table_id) {

  var query = connection.query(`SELECT id FROM ${tableName} WHERE name = ?`,
    attributeName, function (err, rows) {
    if(err) { throw new Error(err); return; }

    var mid_table_id = 0;

    try {
      mid_table_id = rows[0].id;
    } catch (err) {
      // Handle the error here.
      console.log("ERROR WITH RESULT: ", rows);
      console.log("CAUSED BY: ", attributeName, " to be used in ", tableName);
    }


    //console.log("mid_table_id: ",mid_table_id);

    if(mid_table_id != 0) {
      insertMiddle(mid_table_id, tableName, left_table_id);
    } else {
      console.log("ERROR, NO ROW FOUND IN ", tableName, " with name = ",attributeName);
    }

  }); //end mysql connection

}

function insertMiddle(theID, tableName, left_table_id) {
  //console.log("7: ", tableName);
	//2b. insert into middle table
	switch(tableName) {
		case "Ethnicities":
			var midTable = "person_ethnicities";
			var toInsert = {ethnicity_id: theID, person_id: persons[0].length};	break;
		case "Topics":
			var midTable = "person_topics";
			var toInsert = {topic_id: theID, person_id: persons[0].length};	break;
		case "Ensembles":
			var midTable = "person_ensembles";
			var toInsert = {ensemble_id: theID, person_id: persons[0].length};	break;
    case "Instrument_Types":
			var midTable = "person_instrument_types";
			var toInsert = {instrument_type_id: theID, person_id: persons[0].length};	break;
    case "Person_Categories":
      var midTable = "person_person_categories";
      var toInsert = {person_category_id: theID, person_id: persons[0].length};	break;

		default:
			console.log("INVALID TABLE NAME SENT for ",tableName);
			break;
	}
	//console.log("\nTO INSERT: \n", toInsert);
	var query = connection.query(`INSERT INTO ${midTable} SET ?`,
	toInsert, function (err, rows) {
		if(err) { throw new Error(err); return; }

		//console.log("query: ", query.sql);

	});
}

/*
================================================================================
================================================================================
 - END OF INSERTING INTO PERSONS AND MIDDLE TABLES
================================================================================
================================================================================
*/

function rowsToJS(theArray) {
  var temp = JSON.stringify(theArray);
  temp = JSON.parse(temp);
  //console.log(temp);
  return temp;
}

//test: Method for querying intermediate tables:
function getInter(leftTable, rightTable, middleTable, left_table_id, right_table_id, arrayToUse, numLoops ) {

    for(var varI = 1; varI <= numLoops; varI++) {
        var query = connection.query(`
          SELECT L.name
          FROM ${leftTable} L
          INNER JOIN ${middleTable} MT ON MT.${left_table_id} = L.id
          INNER JOIN ${rightTable} RT on MT.${right_table_id} = RT.id
          WHERE RT.id = ${varI}`, function(err, rows, fields) {
            if(err) { throw err; }

            var JSObj = rowsToJS(rows);

            //console.log("=====MIDDLE TALBE=====");

            arrayToUse.push(JSObj);


        });

    }//end for loop
}//end getInter function

//get Resources
function getPersons() {

  //get RESOURCES from db
  connection.query(`SELECT * FROM persons`, function(err, rows, fields) {
            //need type, topics, accompaniment, tags, ethnicities
    if (!err) {

      	var JSObj = rowsToJS(rows);

        persons = [];
        personTopics = [];
        personEnsembles = [];
        personEthnicities = [];
        personInstruments = [];
        personCategories = [];

      	persons.push(JSObj);

        //console.log("PERSON SIZE BEFORE INSERTION: ", persons[0].length);

      	numPersons = persons[0].length;

/*
===================================================
- MIDDLE TABLES -
===================================================
*/
        getInter("Ethnicities",  "persons", "person_ethnicities", "ethnicity_id", "person_id", personEthnicities, numPersons);
        getInter("Topics",       "persons", "person_topics",         "topic_id",  "person_id", personTopics, numPersons);
        getInter("Ensembles",    "persons", "person_ensembles",  "ensemble_id",   "person_id", personEnsembles, numPersons);
        getInter("Instrument_Types",    "persons", "person_instrument_types",  "instrument_type_id",   "person_id", personInstruments, numPersons);
        getInter("Person_Categories",    "persons", "person_person_categories",  "person_category_id",   "person_id", personCategories, numPersons);



    }
    else
      console.log('Error while performing Persons Query.');

  });
} //end getResources()

/*
===================================================
- RESOURCE Controllers -
===================================================
*/

function formatPerson(actualIndex) {
  var personData = {};

  personData = {
    id:             persons[0][actualIndex].id,
    first_name:     persons[0][actualIndex].first_name,
    last_name:      persons[0][actualIndex].last_name,
    email:          persons[0][actualIndex].email,
    city:           persons[0][actualIndex].city,
    state:          persons[0][actualIndex].state,
    country:        persons[0][actualIndex].country,
    url:            persons[0][actualIndex].website,
    social_facebook:persons[0][actualIndex].social_facebook,
    social_twitter: persons[0][actualIndex].social_twitter,
    social_other:   persons[0][actualIndex].social_other,
    emphasis:       persons[0][actualIndex].emphasis,
    hymn_soc_member:persons[0][actualIndex].hymn_soc_member,
    topics:         personTopics[actualIndex],
    ensembles:      personEnsembles[actualIndex],
    ethnicities:    personEthnicities[actualIndex],
    categories:     personCategories[actualIndex],
    instruments:    personInstruments[actualIndex],
    user_id:        persons[0][actualIndex].user_id,
    user:           persons[0][actualIndex].user


  };

  var theUrl = "/person/" + String(actualIndex+1);

  var finalObj = {
    url: theUrl,
    data: personData
  };

  //var str = JSON.stringify(finalObj);

  return finalObj;


}

//RESOURCE GET REQUEST
personController.getConfig = {

  handler: function (request, reply) {

    getPersons();

    //console.log("\n\nETHS[", persons[0].length-1, "] => ",personEthnicities[persons[0].length-1]);

    if (request.params.id) {
        if ((numPersons <= request.params.id - 1) || (0 > request.params.id - 1)) {
          //return reply('Not enough resources in the database for your request').code(404);
          return reply(Boom.notFound("Index out of range for Persons get request"));
        }
        //if (resources.length <= request.params.id - 1) return reply('Not enough resources in the database for your request').code(404);
        var actualIndex = Number(request.params.id -1 );  //if you request for resources/1 you'll get resources[0]

        //create new object, convert to json
        var str = formatPerson(actualIndex);

        return reply(str);

      //return reply(resources[actualId]);
    }

    //if no ID specified
    var objToReturn = [];

    for(var i=0; i < persons[0].length; i++) {
      var temp = formatPerson(i);
      objToReturn.push(temp);
    }

    return reply(objToReturn);
  }
};

//RESOURCE POST REQUEST
personController.postConfig = {

  handler: function(req, reply) {

  	getPersons();

  	var thePersonID = persons.length;
/*
    var theData = {
      name: 			    req.payload.title,
      website: 			  req.payload.url,
      author: 			  req.payload.author,

      parent: 			  req.payload.parent,

      description: 		req.payload.description,
      categories: 		req.payload.categories,
      topic: 			    req.payload.topic,
      accompaniment: 	req.payload.accompaniment,
      languages: 		  req.payload.languages,
      ensembles : 		req.payload.ensembles,
      ethnicities : 	req.payload.ethnicities,
      hymn_soc_member:req.payload.hymn_soc_member,
      //city: 			req.payload.city,
      //state: 			req.payload.state,
      //country: 			req.payload.country

    };
*/
    //console.log("\nRECEIVED :", req.payload.data);

    var theData = {
      first_name:             req.payload.data.first_name,
      last_name:             req.payload.data.last_name,
      email:          req.payload.data.email,
      city:           req.payload.data.city,
      state:           req.payload.data.state,
      country:      req.payload.data.country,
      website:          req.payload.data.url,
      social_facebook:          req.payload.data.social_facebook,
      social_twitter:          req.payload.data.social_twitter,
      social_other:          req.payload.data.social_other,
      emphasis:       req.payload.data.emphasis,
      hymn_soc_member:            req.payload.data.hymn_soc_member,
      topics:    req.payload.data.topics,
      ensembles:        req.payload.data.ensembles,
      ethnicities:      req.payload.data.ethnicities,
      user_id:          req.payload.uid,
      user:             req.payload.user,
      
      instruments:      req.payload.data.instruments,
      categories:       req.payload.data.categories

    };

    insertPerson(theData);

    var toReturn = {

    	person_id: persons[0].length +1 /* +1 or not?... */

    }


    return reply(toReturn);

  }
  /* ADD COMMA ^
  validate: {
    payload: {
      title: 	Joi.string().required(),
      url: 	Joi.string().required(),
      description: Joi.string().required(),
      author: 	Joi.string().allow(''),

      ethnicities: Joi.array().allow(''),
      categories: Joi.array().allow(''),
      topic: 	Joi.array().allow(''),
      accompaniment: Joi.array().allow(''),
      languages: Joi.array().allow(''),
      ensembles: Joi.array().allow(''),
      parent: 	Joi.string().allow(''),
      hymn_soc_member: Joi.string().allow('')

    }
  }
*/
};





module.exports = [
	{ path: '/person', method: 'POST', config: personController.postConfig },
    { path: '/person/{id?}', method: 'GET', config: personController.getConfig },
  //{ path: '/resource/{id}', method: 'DELETE', config: resourceController.deleteConfig},
  //{ path: '/resource/activate/{id}', method: 'PUT', config: resourceController.activateConfig}
];
