var Joi = require('joi');
var mysql = require('mysql');
var Boom = require('boom');

//var mysql = require('promise-mysql');

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



resourceController = {};
var resources = [];
  var numRes = 0;
  var resTypes = [];
  var resCategories = [];
  var resTopics =[];
  var resAcc = [];
  var resLanguages = [];
  var resTags = [];
  var resEnsembles = [];
  var resEth = [];



getResources();

function insertResource(theObj) {

  var justResource = JSON.parse(JSON.stringify(theObj));

//delete columns not stored in the resources table!
  if(typeof justResource.ethnicities !== "undefined") { delete justResource.ethnicities; }
  if(typeof justResource.categories !== "undefined") { delete justResource.categories; }
	if(typeof justResource.topic !== "undefined") { delete justResource.topic; }
	if(typeof justResource.topics !== "undefined") { delete justResource.topic; }
  if(typeof justResource.accompaniment !== "undefined") { delete justResource.accompaniment; }
  if(typeof justResource.languages !== "undefined") { delete justResource.languages; }
  if(typeof justResource.ensembles !== "undefined") { delete justResource.ensembles; }

// TYPE CONVERSION
  if(typeof justResource.hymn_soc_member == "string") {
    if(justResource.hymn_soc_member == "no" || justResource.hymn_soc_member == "No") {
      justResource.hymn_soc_member = false;
    } else {
      justResource.hymn_soc_member = true;
    }
  } else if(typeof justResource.hymn_soc_member == number) {
    if(justResource.hymn_soc_member == 0) {
      justResource.hymn_soc_member = false;
    } else {
      justResource.hymn_soc_member = true;
    }
  } else {
    //neither a string nor Number
    justResource.hymn_soc_member = false;
  }

  if(typeof justResource.is_free == "string") {
    if(justResource.is_free == "yes" || justResource.is_free == "Yes") {
      justResource.is_free = true;
    } else {
      justResource.is_free = false;
    }
  } else if(typeof justResource.is_free == number) {
    if(justResource.is_free == 0) {
      justResource.is_free = false;
    } else {
      justResource.is_free = true;
    }
  } else {
    //neither a string nor Number
    justResource.is_free = false;
  }

// END TYPE CONVERSION

	connection.query(`INSERT INTO resources set ?`, justResource, function(err, rows, fields) {
        if(err) { throw err; }

        var JSObj = rowsToJS(theObj);

        resources[0].push(JSObj);

        console.log("NOW RESOURCES.LENGTH IS: ", resources[0].length);

        //console.log("ethnicities length: ", Object.keys(theObj.ethnicities).length);

        //console.log("FIRST KEY IN ETHNICITIES: ",Object.keys(theObj.ethnicities)[0]);

        //var ethlength = Object.keys(theObj.ethnicities).length;

      //for multiple ethnicities
      for(var i=0; i< Object.keys(theObj.ethnicities).length; i++) {
      	getID_left(theObj, i, "Ethnicities", "ethnicity_id");
  	  }

    	//for multiple CATEGORIES
    	for(var i=0; i< Object.keys(theObj.categories).length; i++) {
    		getID_left(theObj, i, "Resource_Categories", "resource_category_id");

    	}

    	//for multiple TOPICS
    	for(var i=0; i< Object.keys(theObj.topic).length; i++) {
    		getID_left(theObj, i, "Topics", "topic_id");

    	}

    	//for multiple Accompaniment
    	for(var i=0; i< Object.keys(theObj.accompaniment).length; i++) {
    		getID_left(theObj, i, "Accompaniment", "accompaniment_id");

    	}

    	//for multiple Ensembles
    	for(var i=0; i< Object.keys(theObj.ensembles).length; i++) {
    		getID_left(theObj, i, "Ensembles", "ensemble_id");

    	}

      for(var i=0; i< Object.keys(theObj.languages).length; i++) {
          getID_left(theObj, i, "Languages", "language_id");
      }

        //getIDAttribute(theObj, 1);
    });
};

  function checkIfExists(other_text, tableName) {
    var query = connection.query(`SELECT FROM ${tableName} WHERE other_text = ?`, other_text, function (err, rows) {
  		if(err) { throw new Error(err); return; }

      console.log(`SELECTED FROM ${tableName}... \n RESULT: `, query.sql);

      if(!rows[0]) {
        return false;
      }
      else {
        return true;
      }
  		
    });
  };

  function insertIfNotExists(toInsert, tableName) {
    var query = connection.query(`INSERT INTO ${tableName} SET ?`,toInsert, function (err, rows) {
  		if(err) { throw new Error(err); return; }

  		console.log(`INSERTED OTHER CATEGORY INTO ${tableName}... \nquery: `, query.sql);
    });
  };

function checkIfTrue(param1, theObj, whichIndex, tableName) {
  var attributeName = Object.keys(theObj[param1])[whichIndex];
  if(attributeName == "Other" || attributeName == "other") {
      //insert into "other_text" column
      var theOtherText = theObj[param1][attributeName];

      if(!alreadyExists) {
        var toInsert = {
          name: "Other",
          other_text: theOtherText
        };

        var alreadyExists = checkIfExists(theOtherText, tableName);
      }


 } else if(theObj[param1][attributeName] == false || theObj[param1][attributeName] == "false") {
     attributeName = "false";

 } else {
    console.log ("It's True for: ", attributeName);
  }

  return attributeName;
}

function getID_left(theObj, whichIndex, tableName, left_table_id) {
	console.log("done with insertResource()");

	switch(tableName) {

		case "Ethnicities":
			//var attributeName = theObj.ethnicities[whichIndex].name;
      /*
      var attributeName = Object.keys(theObj.ethnicities)[0];
      if(theObj.ethnicities[attributeName] == true) {
         console.log ("It's True for: ", attributeName);

      } else {
        attributeName = "false";
      }
      */
      var attributeName = checkIfTrue("ethnicities", theObj, whichIndex, tableName);
			break;
		case "Resource_Categories":
			//var attributeName = theObj.categories[whichIndex].name;
      var attributeName = checkIfTrue("categories", theObj, whichIndex, tableName);
			break;
		case "Categories":
			//var attributeName = theObj.categories[whichIndex].name;
			break;
		case "Ensembles":
			//var attributeName = theObj.ensembles[whichIndex].name;
      var attributeName = checkIfTrue("ensembles", theObj, whichIndex, tableName);
			break;
		case "Denominations":
			//var attributeName = theObj.denominations[whichIndex].name;
      var attributeName = checkIfTrue("denominations", theObj, whichIndex, tableName);
			break;
		case "Languages":
			//var attributeName = theObj.languages[whichIndex].name;
      var attributeName = checkIfTrue("languages", theObj, whichIndex, tableName);
			break;
		case "Instrument_Types":
			//var attributeName = theObj.instruments[whichIndex].name;
			break;
		case "Topics":
			//var attributeName = theObj.topic[whichIndex].name;
      var attributeName = checkIfTrue("topic", theObj, whichIndex, tableName);
			break;
    case "Topic":
			//var attributeName = theObj.topic[whichIndex].name;
      var attributeName = checkIfTrue("topic", theObj, whichIndex, tableName);
			break;
		case "Accompaniment":
			//var attributeName = theObj.accompaniment[whichIndex].name;
      var attributeName = checkIfTrue("accompaniment", theObj, whichIndex, tableName);
			break;
		default:
			console.log("INVALID TABLE NAME SENT for ",tableName);
			break;
	}//end switch

	console.log("attributeName:", attributeName);

	var mid_table_id = 0;

  if(attributeName !== "false") {
    	//2a
    	var query = connection.query(`SELECT id from ${tableName} WHERE name = ?`,
    	attributeName, function (err, rows) {
    		if(err) { throw new Error(err); return; }

        console.log("=========================");
        console.log(query.sql);
        console.log("=========================")

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
			var midTable = "resource_ethnicities";
			var toInsert = {ethnicity_id: theID,resource_id: resources[0].length};	break;
		case "Resource_Categories":
			var midTable = "resource_resource_categories";
			var toInsert = {resource_category_id: theID,resource_id: resources[0].length};	break;
		case "Ensembles":
			var midTable = "resource_ensembles";
			var toInsert = {ensemble_id: theID,resource_id: resources[0].length};	break;
		case "Authors":
			var midTable = "resource_authors";
			var toInsert = {author_id: theID,resource_id: resources[0].length};	break;
		case "Denominations":
			var midTable = "resource_denominations";
			var toInsert = {denomination_id: theID,resource_id: resources[0].length};	break;
		case "Languages":
			var midTable = "resource_languages";
			var toInsert = {language_id: theID,resource_id: resources[0].length};	break;
		case "Instrument_Types":
			var midTable = "resource_instruments";
			var toInsert = {instrument_type_id: theID,resource_id: resources[0].length};	break;
		case "Topics":
			var midTable = "resource_topics";
			var toInsert = {topic_id: theID,resource_id: resources[0].length};	break;
		case "Accompaniment":
			var midTable = "resource_accompaniment";
			var toInsert = {accompaniment_id: theID,resource_id: resources[0].length};	break;
		default:
			console.log("INVALID TABLE NAME SENT for ",tableName);
			break;
	}
	//var toInsert = {ethnicity_id: theID,resource_id: resources[0].length}
	console.log("\nTO INSERT: \n", toInsert);
	var query = connection.query(`INSERT INTO ${midTable} SET ?`,
	toInsert, function (err, rows) {
		if(err) { throw new Error(err); return; }

		console.log("query: ", query.sql);

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
        connection.query(`
          SELECT L.name
          FROM ${leftTable} L
          INNER JOIN ${middleTable} MT ON MT.${left_table_id} = L.id
          INNER JOIN ${rightTable} RT on MT.${right_table_id} = RT.id
          WHERE RT.id = ${varI}`, function(err, rows, fields) {
            if(err) { throw err; }

            var JSObj = rowsToJS(rows);

            arrayToUse.push(JSObj);


        });

    }//end for loop
}//end getInter function

//get Resources
function getResources() {

  //get RESOURCES from db
  connection.query(`SELECT * from resources`, function(err, rows, fields) {
            //need type, topics, accompaniment, tags, ethnicities
    if (!err) {

      	var JSObj = rowsToJS(rows);

        resources = [];
        resTypes = [];
        resCategories = [];
        resTopics =[];
        resAcc = [];
        resLanguages = [];
        resTags = [];
        resEnsembles = [];
        resEth = [];

      	resources.push(JSObj);

        console.log("RESOURCE SIZE BEFORE INSERTION: ", resources[0].length);

      	numRes = resources[0].length;

/*
===================================================
- MIDDLE TABLES -
===================================================
*/
    getInter("Resource_Categories",  "resources", "resource_resource_categories", "resource_category_id", "resource_id", resCategories, numRes);
    getInter("Topics",          "resources", "resource_topics",         "topic_id", "resource_id", resTopics, numRes);

    getInter("Tags",            "resources", "resource_tags",           "tag_id", "resource_id", resTags, numRes);

    getInter("Ethnicities",     "resources", "resource_ethnicities",    "ethnicity_id", "resource_id", resEth, numRes);
    getInter("Accompaniment", 	"resources", "resource_accompaniment", 	"accompaniment_id", "resource_id", resAcc, numRes);
    getInter("Ensembles",       "resources", "resource_ensembles",  "ensemble_id", "resource_id", resEnsembles, numRes);
    getInter("Languages",       "resources", "resource_languages",  "language_id", "resource_id", resLanguages, numRes);


    }
    else
      console.log('Error while performing Resources Query.');

  });
} //end getResources()

/*
===================================================
- RESOURCE Controllers -
===================================================
*/

function formatResource(actualIndex) {
  var resourceData = {};

  resourceData = {
    id:             resources[0][actualIndex].id,
    title:          resources[0][actualIndex].name,
    type:           resources[0][actualIndex].type,
    url:            resources[0][actualIndex].website,
    resource_date:  resources[0][actualIndex].resource_date,
    description:    resources[0][actualIndex].description,
    parent:  resources[0][actualIndex].parent,
    topics:         resTopics[actualIndex],
    accompaniment: 	resAcc[actualIndex],
    tags:         resTags[actualIndex],
    //tags:           resTags[actualIndex],
    //categories:     resCategories[actualIndex],
    is_active:      resources[0][actualIndex].is_active,
    high_level:     resources[0][actualIndex].high_level,
    city:        resources[0][actualIndex].city,
    state:       resources[0][actualIndex].state,
    country:     resources[0][actualIndex].country,
    hymn_soc_member:resources[0][actualIndex].hymn_soc_member,
    //ethnicities
    ethnicities:    resEth[actualIndex],
    //eth id
    is_free:        resources[0][actualIndex].is_free,
    languages:      resLanguages[actualIndex]

  };

  var theUrl = "/resource/" + String(actualIndex+1);

  var finalObj = {
    url: theUrl,
    data: resourceData
  };

  //var str = JSON.stringify(finalObj);

  return finalObj;


}

//RESOURCE GET REQUEST
resourceController.getConfig = {



  handler: function (request, reply) {

    getResources();

    if (request.params.id) {
        if (numRes <= request.params.id - 1) {
          //return reply('Not enough resources in the database for your request').code(404);
          return reply(Boom.notFound());
        }
        //if (resources.length <= request.params.id - 1) return reply('Not enough resources in the database for your request').code(404);
        var actualIndex = Number(request.params.id -1 );  //if you request for resources/1 you'll get resources[0]

        //create new object, convert to json
        var str = formatResource(actualIndex);



        return reply(str);


      //return reply(resources[actualId]);
    }

    //if no ID specified
    var objToReturn = [];

    for(var i=0; i < resources[0].length; i++) {
      var bob = formatResource(i);
      objToReturn.push(bob);
    }

    //console.log(objToReturn);

    reply(objToReturn);
  }
};

//RESOURCE POST REQUEST
resourceController.postConfig = {

  handler: function(req, reply) {

  	getResources();

  	var theResourceID = resources.length+1;
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
      name:             req.payload.data.title,
      type:             req.payload.data.type,
      website:          req.payload.data.url,
      author:           req.payload.data.author,
      parent:           req.payload.data.parent,
      description:      req.payload.data.description,
      hymn_soc_member:  req.payload.data.hymn_soc_member,
      is_free:          req.payload.data.is_free,
      categories:       req.payload.data.categories,
      topic:            req.payload.data.topic,
      accompaniment:    req.payload.data.accompaniment,
      languages:        req.payload.data.languages,
      ensembles:        req.payload.data.ensembles,
      ethnicities:      req.payload.data.ethnicities

    };

    insertResource(theData);

    getResources();

    var toReturn = {

    	resource_id: resources[0].length +1 /* +1 or not?... */
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
      //is_free: Joi.string().required()
      parent: 	Joi.string().allow(''),
      hymn_soc_member: Joi.string().allow(''),
      is_free: Joi.string().allow('')

    }
  }
*/
};

//RESOURCE DELETE ENDPOINT
resourceController.deleteConfig = {
    handler: function(request, reply) {
        getResources();
      	var theResourceID = resources.length+1;

        if (request.params.id) {
            if (numRes <= request.params.id - 1) {
              //return reply('Not enough resources in the database for your request').code(404);
              return reply(Boom.notFound());
            }
            //if (resources.length <= request.params.id - 1) return reply('Not enough resources in the database for your request').code(404);
            var actualIndex = Number(request.params.id -1 );  //if you request for resources/1 you'll get resources[0]

            var mysqlIndex = Number(request.params.id);

            connection.query(`
            UPDATE resources SET is_active = false
            WHERE id = ${mysqlIndex}`, function(err, rows, fields) {
              if(err) {
                  throw err;
              } else {
                  console.log("set resource #", mysqlIndex, " to innactive (is_active = false)");
              }

              return reply( {code: 200} );
            });

          //return reply(resources[actualId]);
        }


    }
};

//RESOURCE MAKE ACTIVE ENDPOINT
//RESOURCE DELETE ENDPOINT
resourceController.activateConfig = {
    handler: function(request, reply) {
        getResources();
      	var theResourceID = resources.length+1;

        if (request.params.id) {
            if (numRes <= request.params.id - 1) {
              //return reply('Not enough resources in the database for your request').code(404);
              return reply(Boom.notFound());
            }
            //if (resources.length <= request.params.id - 1) return reply('Not enough resources in the database for your request').code(404);
            var actualIndex = Number(request.params.id -1 );  //if you request for resources/1 you'll get resources[0]

            var mysqlIndex = Number(request.params.id);

            connection.query(`
            UPDATE resources SET is_active = true
            WHERE id = ${mysqlIndex}`, function(err, rows, fields) {
              if(err) {
                  throw err;
              } else {
                  console.log("set resource #", mysqlIndex, " to active (is_active = true)");
              }

              return reply( {code: 200} );
            });

          //return reply(resources[actualId]);
        }


    }
};

function JUSTUGH(theObj) {

	//getResources();

	var noEth = JSON.parse(JSON.stringify(theObj));

  console.log("inserting resource ", noEth);
	//change title to name!



  delete noEth.ethnicities;
	//delete noEth.author;
	//delete noEth.parents;
	delete noEth.categories;
	delete noEth.topic;
	delete noEth.accompaniment;
	delete noEth.languages;
	delete noEth.ensembles;


	var query = connection.query(`INSERT INTO resources SET ?`, noEth, function(err, rows, fields) {
        if(err) { throw err; }

        console.log(query.sql);

        var JSObj = rowsToJS(theObj);

        resources[0].push(JSObj);
    });
}


module.exports = [
	{ path: '/resource', method: 'POST', config: resourceController.postConfig },
  { path: '/resource/{id?}', method: 'GET', config: resourceController.getConfig },
  { path: '/resource/{id}', method: 'DELETE', config: resourceController.deleteConfig},
  { path: '/resource/activate/{id}', method: 'PUT', config: resourceController.activateConfig}
];
