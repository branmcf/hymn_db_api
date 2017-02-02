var Joi = require('joi');
var mysql = require('mysql');
var Boom = require('boom');

//var mysql = require('promise-mysql');

//mysql connection
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123',
  database : 'testDb'
  //port     : options.port

});




personController = {};
var persons = [];
  var numPersons = 0;
  var personTopics = [];
  var personEnsembles = [];
  var personEthnicities =[];




getPersons();

function insertPerson(theObj) {

  var justPerson = JSON.parse(JSON.stringify(theObj));

//delete columns not stored in the resources table!
    if(typeof justPerson.ethnicities !== "undefined") { delete justPerson.ethnicities; }
    if(typeof justPerson.ensembles !== "undefined") { delete justPerson.ensembles; }
    if(typeof justPerson.topic !== "undefined") { delete justPerson.topic; }
    if(typeof justPerson.topics !== "undefined") { delete justPerson.topics; }


// TYPE CONVERSION
  if(typeof justPerson.hymn_soc_member == "string") {
    if(justPerson.hymn_soc_member == "no" || justPerson.hymn_soc_member == "No") {
      justPerson.hymn_soc_member = false;
    } else {
      justPerson.hymn_soc_member = true;
    }
} else if(typeof justPerson.hymn_soc_member == Number) {
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

	connection.query(`insert into persons set ?`, justPerson, function(err, rows, fields) {
        if(err) { throw err; }

        //var JSObj = rowsToJS(theObj);

        //persons[0].push(JSObj);
        persons[0].push(theObj);

        console.log("NOW PERSONS.LENGTH IS: ", persons[0].length);

        //console.log("ethnicities length: ", Object.keys(theObj.ethnicities).length);

        //console.log("FIRST KEY IN ETHNICITIES: ",Object.keys(theObj.ethnicities)[0]);

        //var ethlength = Object.keys(theObj.ethnicities).length;

        //Object.keys(theObj.ethnicities).length

      //for multiple ethnicities
        for(var i=0; i< Object.keys(theObj.ethnicities).length ; i++) {
            //console.log(">>>Ethnicities #", i);
      	    getID_left(theObj, i, "Ethnicities", "ethnicity_id");
  	    }

    	//for multiple ensembles
    	for(var i=0; i< Object.keys(theObj.ensembles).length; i++) {
            //console.log(">>>Ensembles #", i);
            getID_left(theObj, i, "Ensembles", "ensemble_id");
    	}

    	//for multiple TOPICS
    	for(var i=0; i< Object.keys(theObj.topics).length; i++) {
            //console.log(">>>Topics #", i);
    		getID_left(theObj, i, "Topics", "topic_id");
    	}

    });
}

function checkIfTrue(param1, theObj, whichIndex, tableName) {
  var attributeName = Object.keys(theObj[param1])[whichIndex];
    if(attributeName == "Other" || attributeName == "other") {
        //insert into "other_text" column
        var theOtherText = theObj[param1][attributeName];
        var toInsert = {
            name: "Other",
            other_text: theOtherText
        };

        var query = connection.query(`INSERT INTO ${tableName} SET ?`,toInsert, function (err, rows) {
          if(err) { throw new Error(err); return; }

          console.log(`INSERTED OTHER CATEGORY INTO ${tableName}... \nquery: `, query.sql);

        });

    } else if (theObj[param1][attributeName] == true || theObj[param1][attributeName] == "true"){
        console.log("TRUE FOR ", attributeName);

    } else {
        attributeName = "false";
    }

  return attributeName;
}

function getID_left(theObj, whichIndex, tableName, left_table_id) {
	console.log("getting name from ", tableName);

    switch(tableName) {

        case "Ethnicities":
			//var attributeName = theObj.ethnicities[whichIndex];
            var attributeName = checkIfTrue("ethnicities", theObj, whichIndex, tableName);
			break;
		case "Topics":
            //var attributeName = theObj.topics[whichIndex];
            var attributeName = checkIfTrue("topics", theObj, whichIndex, tableName);
			break;
		case "Ensembles":
            //var attributeName = theObj.ensembles[whichIndex];
            var attributeName = checkIfTrue("ensembles", theObj, whichIndex, tableName);
			break;
		default:
			console.log("INVALID TABLE NAME SENT for ",tableName, tableName);
			break;
	}//end switch

	//console.log("attributeName:", attributeName);

	var mid_table_id = 0;

    if(attributeName !== "false") {
    	//2a
    	var query = connection.query(`SELECT id from ${tableName} WHERE name = ?`,
    	attributeName, function (err, rows) {
    		if(err) { throw new Error(err); return; }

        //console.log("=========================");
        //console.log(query.sql);
        //console.log("=========================")

        mid_table_id = rows[0].id;
    		console.log("mid_table_id: ",mid_table_id);

        if(mid_table_id != 0) {
    		  insertMiddle(mid_table_id, tableName, left_table_id);
        } else {
          console.log("ERROR, NO ROW FOUND IN ", tableName, " with name = ",attributeName);
        }

    	}); //end mysql connection
  }


}

function insertMiddle(theID, tableName, left_table_id) {
	//2b. insert into middle table
	//console.log("\nABOUT TO INSERT FOR RESOURCE #", resources[0].length, "\n");

	switch(tableName) {
		case "Ethnicities":
			var midTable = "person_ethnicities";
			var toInsert = {ethnicity_id: theID,         person_id: persons[0].length};	break;
		case "Ensembles":
			var midTable = "person_ensembles";
			var toInsert = {ensemble_id: theID,          person_id: persons[0].length};	break;
		case "Topics":
			var midTable = "person_topics";
			var toInsert = {topic_id: theID,             person_id: persons[0].length};	break;
		default:
			console.log("INVALID TABLE NAME SENT for ",tableName);
			break;
	}
	//var toInsert = {ethnicity_id: theID,resource_id: resources[0].length}
	console.log("\nTO INSERT: \n", toInsert);
	connection.query(`INSERT INTO ${midTable} SET ?`,
	toInsert, function (err, rows) {
		if(err) { throw new Error(err); return; }

		//console.log("query: ", query.sql);

	});
}





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

            //console.log(query.sql);

            arrayToUse.push(JSObj);


        });

    }//end for loop
}//end getInter function

//get Resources
function getPersons() {

  //get RESOURCES from db
  connection.query(`SELECT * from persons`, function(err, rows, fields) {
            //need type, topics, accompaniment, tags, ethnicities
    if (!err) {

      	var JSObj = rowsToJS(rows);

        persons = [];
        personTopics = [];
        personEnsembles = [];
        personEthnicities = [];

      	persons.push(JSObj);

        console.log("PERSON SIZE BEFORE INSERTION: ", persons[0].length);

      	numPersons = persons[0].length;

/*
===================================================
- MIDDLE TABLES -
===================================================
*/
        getInter("Ethnicities",  "persons", "person_ethnicities", "ethnicity_id", "person_id", personEthnicities, numPersons);
        getInter("Topics",       "persons", "person_topics",         "topic_id",  "person_id", personTopics, numPersons);
        getInter("Ensembles",    "persons", "person_ensembles",  "ensemble_id",   "person_id", personEnsembles, numPersons);


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
    social_url:     persons[0][actualIndex].social_url,
    emphasis:       persons[0][actualIndex].emphasis,
    hymn_soc_member:persons[0][actualIndex].hymn_soc_member,
    topics:         personTopics[actualIndex],
    ensemble:       personEnsembles[actualIndex],
    ethnicities:    personEthnicities[actualIndex],

    topic: "none" //placeholders for now

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
        if (numPersons <= request.params.id - 1) {
          //return reply('Not enough resources in the database for your request').code(404);
          return reply(Boom.notFound());
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
      is_free: 			  req.payload.is_free
      //city: 			req.payload.city,
      //state: 			req.payload.state,
      //country: 			req.payload.country

    };
*/
    console.log("\nRECEIVED :", req.payload.data);

    var theData = {
      first_name:             req.payload.data.first_name,
      last_name:             req.payload.data.last_name,
      email:          req.payload.data.email,
      city:           req.payload.data.city,
      state:           req.payload.data.state,
      country:      req.payload.data.country,
      website:          req.payload.data.url,
      social_url:          req.payload.data.social_url,
      emphasis:       req.payload.data.emphasis,
      hymn_soc_member:            req.payload.data.hymn_soc_member,
      topics:    req.payload.data.topics,
      ensembles:        req.payload.data.ensemble,
      ethnicities:      req.payload.data.ethnicities

    };

    insertPerson(theData);


    var toReturn = {

    	person_id: persons[0].length +1 /* +1 or not?... */

    }

    getPersons();

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
      //is_free: Joi.string().required()
      parent: 	Joi.string().allow(''),
      hymn_soc_member: Joi.string().allow(''),
      is_free: Joi.string().allow('')

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
