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

if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
}

connection.connect();

congController = {};
var congs = [];
  var numCongs = 0;
  var congDen = [];
  var congCategories = [];
  var congInstr = [];
  var congEth = [];
  var congTags = [];
  var congLanguages = [];

getCongregations();

function rowsToJS(theArray) {
  var temp = JSON.stringify(theArray);
  temp = JSON.parse(temp);
  //console.log(temp);
  return temp;
}

function getCongregations() {
  console.log("getting congregations...");
  //get congregations from db
  connection.query('SELECT * from congregations', function(err, rows, fields) {
    if (!err) {

      congs = [];
      numCongs = 0;
      congDen = [];
      congCategories = [];
      congInstr = [];
      congEth = [];
      congTags = [];
      congLanguages = [];

      var JSObj = rowsToJS(rows);
      congs.push(JSObj);
      numCongs = congs[0].length;

      getInter("Languages", 	"congregations", "congregation_languages", 		"language_id", 		"congregation_id", congLanguages, numCongs);
      //getInter("Cong_Types",    	"congregations", "congregation_types" ,				"congregation_type_id", "congregation_id", congCategories, numCongs);
      getInter("Instrument_Types", 	 "congregations", "congregation_instrument_types", 	      "instrument_type_id", 	"congregation_id", congInstr, numCongs);
      getInter("Ethnicities",  		   "congregations", "congregation_ethnicities",  		        "ethnicity_id", 			"congregation_id", congEth, numCongs);
      getInter("Tags", 				"congregations", "congregation_tags", 				"tag_id", 				"congregation_id", congTags, numCongs);
      getInter("Congregation_Categories","congregations", "congregation_congregation_categories", "congregation_category_id", "congregation_id",  congCategories, numCongs);


    }
    else
      console.log('Error while performing Congregations Query.');

  });
}//end getCongregations function

/*
================================================================================
================================================================================
 - FOR INSERTING INTO CONGS AND MIDDLE TABLES
================================================================================
================================================================================
*/
function insertCongregation(theObj) {

  var justCongregation = JSON.parse(JSON.stringify(theObj));

//delete columns not stored in the congregations table!
  if(typeof justCongregation.tags !== "undefined") { delete justCongregation.tags; }
  if(typeof justCongregation.categories !== "undefined") { delete justCongregation.categories; }
  if(typeof justCongregation.instruments !== "undefined") { delete justCongregation.instruments; }
  if(typeof justCongregation.languages !== "undefined") { delete justCongregation.languages; }
  if(typeof justCongregation.ethnicities !== "undefined") { delete justCongregation.ethnicities; }

// TYPE CONVERSION
  if(typeof justCongregation.hymn_soc_member == "string") {
    if(justCongregation.hymn_soc_member == "no" || justCongregation.hymn_soc_member == "No") {
      justCongregation.hymn_soc_member = false;
    } else {
      justCongregation.hymn_soc_member = true;
    }
  } else if(typeof justCongregation.hymn_soc_member == "number") {
    if(justCongregation.hymn_soc_member == 0) {
      justCongregation.hymn_soc_member = false;
    } else {
      justCongregation.hymn_soc_member = true;
    }
  } else {
    //neither a string nor Number
    justCongregation.hymn_soc_member = false;
  }

  if(typeof justCongregation.is_free == "string") {
    if(justCongregation.is_free == "yes" || justCongregation.is_free == "Yes") {
      justCongregation.is_free = 1;
    } else if(justCongregation.is_free == "no" || justCongregation.is_free == "No") {
      justCongregation.is_free = 0;
    } else {
      justCongregation.is_free = 2;
    }
  } else if(typeof justCongregation.is_free !== "number") {
    justCongregation.is_free = 2;
  }

  if(typeof justCongregation.events_free == "string") {
    if(justCongregation.events_free == "yes" || justCongregation.events_free == "Yes") {
      justCongregation.events_free = 1;
    } else if(justCongregation.events_free == "no" || justCongregation.events_free == "No") {
      justCongregation.events_free = 0;
    } else {
      justCongregation.events_free = 2;
    }
  } else if(typeof justCongregation.events_free !== "number") {
    justCongregation.events_free = 2;
  }

// END TYPE CONVERSION

	connection.query(`INSERT INTO congregations set ?`, justCongregation, function(err, rows, fields) {
        if(err) { throw err; }

        var JSObj = rowsToJS(theObj);

        congs[0].push(JSObj);

        //console.log("ethnicities length: ", Object.keys(theObj.ethnicities).length);

        //console.log("FIRST KEY IN ETHNICITIES: ",Object.keys(theObj.ethnicities)[0]);

        //var ethlength = Object.keys(theObj.ethnicities).length;

      //for multiple ethnicities
<<<<<<< HEAD
        if("ethnicities" in theObj && typeof theObj.ethnicities !== "undefined" && typeof theObj.ethnicities !== "null") {
=======
        if("ethnicities" in theObj && (theObj.ethnicities !== undefined)) {
>>>>>>> cf6788bef65521e9758d7cfb79e64d35475811e0
          for(var i=0; i< Object.keys(theObj.ethnicities).length; i++) {
            getID_left(theObj, i, "Ethnicities", "ethnicity_id");
          }
        } else { console.log("No ethnicities passed in..."); }
        
<<<<<<< HEAD
        if("tags" in theObj && typeof theObj.tags !== "undefined" && typeof theObj.tags !== "null") {
          for(var i=0; i< Object.keys(theObj.tags).length; i++) {
            getID_left(theObj, i, "Tags", "topic_id");
          }
        } else { console.log("No tags passed in..."); }

        if("categories" in theObj && typeof theObj.categories !== "undefined" && typeof theObj.categories !== "null") { 
          for(var i=0; i< Object.keys(theObj.categories).length; i++) {
            getID_left(theObj, i, "Congregation_Categories", "category_id");
          }
        } else { console.log("No categories passed in..."); }
        
        if("languages" in theObj && typeof theObj.languages !== "undefined" && typeof theObj.languages !== "null") { 
          for(var i=0; i< Object.keys(theObj.languages).length; i++) {
              getID_left(theObj, i, "Languages", "language_id");
          }
        } else { console.log("No languages passed in..."); }

        if("instruments" in theObj && typeof theObj.instruments !== "undefined" && typeof theObj.instruments !== "null") {
          for(var i=0; i< Object.keys(theObj.instruments).length; i++) {
              getID_left(theObj, i, "Instrument_Types", "instrument_id");
              
              if(i == Object.keys(theObj.instruments).length - 1) {
                getCongregations();
              }
          }
        } else { console.log("No instruments passed in..."); getCongregations();}

=======
        if("tags" in theObj && (theObj.tags !== undefined)) {
          //console.log("=======\n", theObj);
          for(var i=0; i< Object.keys(theObj.tags).length; i++) {
            getID_left(theObj, i, "Tags", "topic_id");
          }
        }
        if("categories" in theObj && (theObj.tags !== categories)) { 
          for(var i=0; i< Object.keys(theObj.categories).length; i++) {
            getID_left(theObj, i, "Congregation_Categories", "category_id");
          }
        }
        if("languages" in theObj && (theObj.languages !== undefined)) {
          for(var i=0; i< Object.keys(theObj.languages).length; i++) {
              getID_left(theObj, i, "Languages", "language_id");
          }
        }
        if("instruments" in theObj && (theObj.instruments !== undefined)) {
          for(var i=0; i< Object.keys(theObj.instruments).length; i++) {
              getID_left(theObj, i, "Instrument_Types", "instrument_id");
          }
        }
>>>>>>> cf6788bef65521e9758d7cfb79e64d35475811e0
        
    });
}

function getID_left(theObj, whichIndex, tableName, left_table_id) {
  //console.log("1: ", tableName );

	switch(tableName) {

		case "Ethnicities":
            checkIfTrue("ethnicities", theObj, whichIndex, tableName, left_table_id);
      break;
		case "Congregation_Categories":
            checkIfTrue("categories", theObj, whichIndex, tableName, left_table_id);
			break;
		case "Tags":
			checkIfTrue("tags", theObj, whichIndex, tableName, left_table_id);
			break;
		case "Languages":
            checkIfTrue("languages", theObj, whichIndex, tableName, left_table_id);
			break;
    case "Instrument_Types":
            checkIfTrue("instruments", theObj, whichIndex, tableName, left_table_id);
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
     console.log("False, insert nothing...");

 } else {
    console.log ("It's True for: ", attributeName2);
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
        //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@ NOT FOUND!", rows[0]);
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

  		console.log(`INSERTED OTHER CATEGORY INTO ${tableName}... \nquery: `, query2.sql);

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

          console.log("=========================");
          console.log(query.sql);
          console.log("=========================");

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
      var midTable = "congregation_ethnicities";
      var toInsert = {ethnicity_id: theID, congregation_id: congs[0].length};	break;
    case "Congregation_Categories":
      var midTable = "congregation_congregation_categories";
      var toInsert = {congregation_category_id: theID, congregation_id: congs[0].length};	break;
    case "Languages":
      var midTable = "congregation_languages";
      var toInsert = {language_id: theID, congregation_id: congs[0].length};	break;
    case "Tags":
      var midTable = "congregation_tags";
      var toInsert = {tag_id: theID, congregation_id: congs[0].length};	break;
    case "Instrument_Types":
      var midTable = "congregation_instrument_types";
      var toInsert = {instrument_type_id: theID, congregation_id: congs[0].length};	break;

		default:
			console.log("INVALID TABLE NAME SENT for ",tableName);
			break;
	}
	//console.log("\nTO INSERT: \n", toInsert);
	var query = connection.query(`INSERT INTO ${midTable} SET ?`,
	toInsert, function (err, rows) {
		if(err) { throw new Error(err); return; }

		//console.log("query: ", query.sql);
    if(tableName == "Instrument_Types") {
      //THIS IS VERY HARD-CODED IN
      //but...
      //since languages is the last middle table to be inserted, only call getResources() after its completion because nodejs asynchronous calls are incredibly painful
      getCongregations();
      
    }

	});
}

/*
================================================================================
================================================================================
 - END OF INSERTING INTO CONGS AND MIDDLE TABLES
================================================================================
================================================================================
*/

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
}//end function

/*
===================================================
- CONGREGATION Controllers -
===================================================
*/

function formatCongregation(actualIndex) {
  var congData = {};

  congData = {
    id:             congs[0][actualIndex].id,
    name:           congs[0][actualIndex].name,
    url:            congs[0][actualIndex].website,
    //denominations:  congDen[actualIndex],
    denomination:   congs[0][actualIndex].denomination,
    city:           congs[0][actualIndex].city,
    state:          congs[0][actualIndex].state,
    country:        congs[0][actualIndex].country,
    hymn_soc_member:congs[0][actualIndex].hymn_soc_member,
    categories:     congCategories[actualIndex],
    instruments:    congInstr[actualIndex],
    shape:          congs[0][actualIndex].shape,
    clothing:       congs[0][actualIndex].clothing,
    geography:      congs[0][actualIndex].geography,
    ethnicities:    congEth[actualIndex],
    attendance:     congs[0][actualIndex].attendance,
    //tags
    tags:           congTags[actualIndex],
    is_active:      congs[0][actualIndex].is_active,
    high_level:     congs[0][actualIndex].high_level,

    languages:      congLanguages[actualIndex]

  };

  var theUrl = "/congregation/" + String(actualIndex+1);

  var finalObj = {
    url: theUrl,
    data: congData
  };

  return finalObj;
}

//CONG GET REQUEST
congController.getConfig = {
  handler: function (request, reply) {

    getCongregations();

    if (request.params.id) {
      //if (resources.length <= request.params.id - 1) return reply('Not enough events in the database for your request').code(404);
      if ((numCongs <= request.params.id - 1) || (0 > request.params.id - 1)) {
          //return reply('Not enough resources in the database for your request').code(404);
          return reply(Boom.notFound("Index out of range for Congregation get request"));
      }

      var actualIndex = Number(request.params.id) - 1;
      //create new object, convert to json
      var finalObj = formatCongregation(actualIndex);

      return reply(finalObj);
    }
    //if no ID specified
    //reply(JSON.stringify(congs[0]));

    var objToReturn = [];

    for(var i=0; i < congs[0].length; i++) {
      var bob = formatCongregation(i);
      objToReturn.push(bob);
    }

    reply(objToReturn);
  }
};

//BELOW is for the POST request
function insertFirst(toInsert, _callback){

    insertCongregation(toInsert);

    _callback();    
}

function insertAndGet(toInsert){

    insertFirst(toInsert, function() {
        getCongregations();
        console.log("Done with post requst getCongregations...");
    });    
}

//CONG POST REQUEST
congController.postConfig = {
  handler: function(req, reply) {

    getCongregations();

    var newCong = {
      name:           req.payload.data.name,
      website:        req.payload.data.url,
      denomination:   req.payload.data.denomination,
      city:           req.payload.data.city,
      state:          req.payload.data.state,
      country:        req.payload.data.country,
      hymn_soc_member:req.payload.data.hymn_soc_member,
      categories:     req.payload.data.categories,
      instruments:    req.payload.data.instruments,
      shape:          req.payload.data.shape,
      clothing:       req.payload.data.clothing,
      geography:      req.payload.data.geography,
      ethnicities:    req.payload.data.ethnicities,
      attendance:     req.payload.data.attendance,

      languages:      req.payload.data.languages,
      tags:           req.payload.data.tags
    };
    
    //insertCongregation(newCong);
    //getCongregations();

    insertAndGet(newCong);

    var toReturn = {

    	cong_id: congs[0].length +1 /* +1 or not?... */
    }

    return reply(toReturn);


    //reply(newRes);
  }
  /* ADD COMMA ^
  validate: {
    payload: {
      cong_name: Joi.string().required(),
      website: Joi.string().required(),
      cong_city: Joi.string().required(),
      cong_state: Joi.string().required(),
      cong_country: Joi.string().required(),
      priest_attire: Joi.string().required(),
      denomination_id: Joi.number().required(),
      song_types_id: Joi.number().required(),
      instrument_types_id: Joi.number().required(),
      worship_types_id: Joi.number().required(),
      ethnicity_types_id: Joi.number().required(),
      cong_type_id: Joi.number().required()

    }
  }
  */

};

//delete
congController.deleteConfig = {
  handler: function(request, reply) {
        getCongregations();

        if (request.params.id) {
            if ((numCongs <= request.params.id - 1) || (0 > request.params.id - 1)) {
              //return reply('Not enough users in the database for your request').code(404);
              return reply(Boom.notFound("Error with congregations DELETE endpoint"));
            }

            var query = connection.query(`
            UPDATE congregations SET is_active = false
            WHERE id = ${request.params.id}`, function(err, rows, fields) {
              if(err) {
                  return reply(Boom.badRequest(`Error while trying to DELETE cong with id=${request.params.id}...`));
              } else {
                  console.log("set cong #", request.params.id, " to innactive (is_active = false)");
              }

              getCongregations();

              reply([{
                statusCode: 200,
                message: `Congregation with id=${request.params.id} set to innactive`,
              }]);
            });

        } else {
          return reply(Boom.notFound("You must specify an id as a parameter"));
        }
    }//end handler
}


module.exports = [
	{ path: '/congregation', method: 'POST', config: congController.postConfig },
 	{ path: '/congregation/{id?}', method: 'GET', config: congController.getConfig },
   { path: '/congregation/{id}', method: 'DELETE', config: congController.deleteConfig }

];
