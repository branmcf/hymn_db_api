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

orgController = {};
var orgs = [];
  var numOrgs = 0;
  var orgDen = [];
  var orgTags = [];
  var orgSongTypes = [];
  var orgInstr = [];
  var orgWorshipTypes = [];
  var orgEth = [];
  var orgCategories = [];

getOrganizations();

function rowsToJS(theArray) {
  var temp = JSON.stringify(theArray);
  temp = JSON.parse(temp);
  //console.log(temp);
  return temp;
}

function getOrganizations() {
  console.log("begin getOrgs()...");
  //get orgs from db
  connection.query('SELECT * from organizations', function(err, rows, fields) {
    if (!err) {

    orgs = [];
    numOrgs = 0;
    orgDen = [];
    orgTags = [];
    orgSongTypes = [];
    orgInstr = [];
    orgWorshipTypes = [];
    orgEth = [];
    orgCategories = [];

      var JSObj = rowsToJS(rows);
      orgs.push(JSObj);
      numOrgs = orgs[0].length;


      //getInter("Denominations", "organizations", "organization_denominations", "denomination_id", "organization_id", orgDen, numOrgs);
      //getInter("Tags", "organizations", "organization_tags", "tag_id", "organization_id", orgTags, numOrgs);
      //getInter("Song_Types", "organizations", "organization_song_types", "song_type_id", "organization_id", orgSongTypes, numOrgs);
      getInter("Instrument_Types", "organizations", "organization_instrument_types", "instrument_type_id", "organization_id", orgInstr, numOrgs);
      getInter("Ethnicities", "organizations", "organization_ethnicities", "ethnicity_id", "organization_id", orgEth, numOrgs);
      getInter("Organization_Categories", "organizations", "organization_organization_categories", "organization_category_id", "organization_id", orgCategories, numOrgs);
      //getInter("congregations", "organizations", "organization_congregations", "congregation_id", "organization_id", orgCongs, numOrgs);
      
    }
    else
      console.log('Error while performing Events Query.');

  });
}//end getOrganizations function

/*
================================================================================
================================================================================
 - FOR INSERTING INTO ORGS AND MIDDLE TABLES -
================================================================================
================================================================================
*/
function insertOrganization(theObj) {

  var justOrganization = JSON.parse(JSON.stringify(theObj));

//delete columns not stored in the organizations table!
  if(typeof justOrganization.categories !== "undefined") { delete justOrganization.categories; }
  if(typeof justOrganization.instruments !== "undefined") { delete justOrganization.instruments; }
  if(typeof justOrganization.ethnicities !== "undefined") { delete justOrganization.ethnicities; }

// TYPE CONVERSION
  if(typeof justOrganization.hymn_soc_member == "string") {
    if(justOrganization.hymn_soc_member == "no" || justOrganization.hymn_soc_member == "No") {
      justOrganization.hymn_soc_member = false;
    } else {
      justOrganization.hymn_soc_member = true;
    }
  } else if(typeof justOrganization.hymn_soc_member == "number") {
    if(justOrganization.hymn_soc_member == 0) {
      justOrganization.hymn_soc_member = false;
    } else {
      justOrganization.hymn_soc_member = true;
    }
  } else {
    //neither a string nor Number
    justOrganization.hymn_soc_member = false;
  }

  if(typeof justOrganization.is_free == "string") {
    if(justOrganization.is_free == "yes" || justOrganization.is_free == "Yes") {
      justOrganization.is_free = 1;
    } else if(justOrganization.is_free == "no" || justOrganization.is_free == "No") {
      justOrganization.is_free = 0;
    } else {
      justOrganization.is_free = 2;
    }
  } else if(typeof justOrganization.is_free !== "number") {
    justOrganization.is_free = 2;
  }


// END TYPE CONVERSION

	connection.query(`INSERT INTO organizations set ?`, justOrganization, function(err, rows, fields) {
        if(err) { throw err; }

        var JSObj = rowsToJS(theObj);

        orgs[0].push(JSObj);

        //console.log("ethnicities length: ", Object.keys(theObj.ethnicities).length);

        //console.log("FIRST KEY IN ETHNICITIES: ",Object.keys(theObj.ethnicities)[0]);

        //var ethlength = Object.keys(theObj.ethnicities).length;

      //for multiple ethnicities

        if("ethnicities" in theObj && typeof theObj.ethnicities !== "undefined" && typeof theObj.ethnicities !== "null") {
          for(var i=0; i< Object.keys(theObj.ethnicities).length; i++) {
            getID_left(theObj, i, "Ethnicities", "ethnicity_id");
          }
        } else { console.log("No ethnicities passed in..."); }
        
        if("tags" in theObj && typeof theObj.tags !== "undefined" && typeof theObj.tags !== "null") {
          for(var i=0; i< Object.keys(theObj.tags).length; i++) {
            getID_left(theObj, i, "Tags", "topic_id");
          }
        } else { console.log("No tags passed in..."); }

        if("categories" in theObj && typeof theObj.categories !== "undefined" && typeof theObj.categories !== "null") { 
          for(var i=0; i< Object.keys(theObj.categories).length; i++) {
            getID_left(theObj, i, "Organization_Categories", "category_id");
          }
        } else { console.log("No categories passed in..."); }

        if("instruments" in theObj && typeof theObj.instruments !== "undefined" && typeof theObj.instruments !== "null") {
          for(var i=0; i< Object.keys(theObj.instruments).length; i++) {
              getID_left(theObj, i, "Instrument_Types", "instrument_id");
              
              if(i == Object.keys(theObj.instruments).length - 1) {
                getOrganizations();
              }
          }
        } else { console.log("No instruments passed in..."); getOrganizations();}
        
    });
}

function getID_left(theObj, whichIndex, tableName, left_table_id) {
  //console.log("1: ", tableName );

	switch(tableName) {

		case "Ethnicities":
            checkIfTrue("ethnicities", theObj, whichIndex, tableName, left_table_id);
      break;
		case "Organization_Categories":
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
     //console.log("False, insert nothing...");

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
      var midTable = "organization_ethnicities";
      var toInsert = {ethnicity_id: theID, organization_id: orgs[0].length};	break;
    case "Organization_Categories":
      var midTable = "organization_organization_categories";
      var toInsert = {organization_category_id: theID, organization_id: orgs[0].length};	break;
    case "Languages":
      var midTable = "organization_languages";
      var toInsert = {language_id: theID, organization_id: orgs[0].length};	break;
    case "Tags":
      var midTable = "organization_tags";
      var toInsert = {tag_id: theID, organization_id: orgs[0].length};	break;
    case "Instrument_Types":
      var midTable = "organization_instrument_types";
      var toInsert = {instrument_type_id: theID, organization_id: orgs[0].length};	break;

		default:
			console.log("INVALID TABLE NAME SENT for ",tableName);
			break;
	}
	//console.log("\nTO INSERT: \n", toInsert);
	var query = connection.query(`INSERT INTO ${midTable} SET ?`,
	toInsert, function (err, rows) {
		if(err) { throw new Error(err); return; }


	});
}

/*
================================================================================
================================================================================
 - END OF INSERTING INTO ORGS AND MIDDLE TABLES
================================================================================
================================================================================
*/



//
//Method for querying intermediate tables:
//
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
- ORGANIZATINS -
===================================================
*/

function formatOrg(actualIndex) {
  var orgData = {};

  orgData = {
    id:             orgs[0][actualIndex].id,
    name:           orgs[0][actualIndex].name,
    url:            orgs[0][actualIndex].website,
    parent:         orgs[0][actualIndex].parent,
    //denomination(s)
    //denomination:   orgDen[actualIndex],
    denomination:   orgs[0][actualIndex].denomination,
    city:        	  orgs[0][actualIndex].city,
    state:       	  orgs[0][actualIndex].state,
    country:     	  orgs[0][actualIndex].country,
    geographic_area:orgs[0][actualIndex].geography,
    is_org_free:    orgs[0][actualIndex].is_free,
    events_free:    orgs[0][actualIndex].offers_free_events,
    membership_free:orgs[0][actualIndex].membership_free,
    mission:        orgs[0][actualIndex].mission,
    process:        orgs[0][actualIndex].the_process,
    //tags
    //tags:           orgTags[actualIndex],
    hymn_soc_member:orgs[0][actualIndex].hymn_soc_member,
    is_active:      orgs[0][actualIndex].is_active,
    high_level:     orgs[0][actualIndex].high_level,
    user_id:        orgs[0][actualIndex].user_id,
    user:           orgs[0][actualIndex].user,

    shape:          orgs[0][actualIndex].shape,
    priest_attire:  orgs[0][actualIndex].priest_attire,
    categories:     orgCategories[actualIndex],
    instruments:    orgInstr[actualIndex],
    ethnicities:    orgEth[actualIndex]
  


  };

  var theUrl = "/orgs/" + String(actualIndex+1);

  var finalObj = {
    url: theUrl,
    data: orgData
  };

  //var str = JSON.stringify(finalObj);

  return finalObj;
}

//ORG GET REQUEST
orgController.getConfig = {
  handler: function (request, reply) {
    if (request.params.id) {

        getOrganizations();
        
      //if (resources.length <= request.params.id - 1) return reply('Not enough events in the database for your request').code(404);      //
      if ((numOrgs <= request.params.id - 1) || (0 > request.params.id - 1)) {
          //return reply('Not enough resources in the database for your request').code(404);
          return reply(Boom.notFound("Index out of range for Orgs get request"));
      }

      var actualIndex = Number(request.params.id) - 1;
      //create new object, convert to json

      finalObj = formatOrg(actualIndex);

      return reply(finalObj);
    }

    var objToReturn = [];

    for(var i=0; i < orgs[0].length; i++) {
      var bob = formatOrg(i);
      objToReturn.push(bob);
    }

    return reply(objToReturn);
  }
};
//
//BELOW is for the POST request
//
function insertFirst(toInsert, _callback){

    insertOrganization(toInsert);

    _callback();    
}

function insertAndGet(toInsert){

    insertFirst(toInsert, function() {
        getOrganizations();
        //console.log("Done with post requst getOrg...");
    });    
}

//ORG POST REQUEST
orgController.postConfig = {

  handler: function(req, reply) {

    getOrganizations();


    var newOrg = {
      name: req.payload.data.name,
      website: req.payload.data.url,
      parent: req.payload.data.parent,
      denomination: req.payload.data.denomination,
      city: req.payload.data.city,
      state: req.payload.data.state,
      country: req.payload.data.country,
      geography: req.payload.data.geographic_area,
      is_free: req.payload.data.is_org_free,
      offers_free_events: req.payload.data.events_free,
      membership_free: req.payload.data.membership_free,
      mission: req.payload.data.mission,
      the_process: req.payload.data.process,
      //tag_id: req.payload.data.tag_id,
      hymn_soc_member: req.payload.data.hymn_soc_member,
      user:             req.payload.user,
      user_id:          req.payload.uid,
      priest_attire:    req.payload.data.priest_attire,
      shape:            req.payload.data.shape,
      categories:       req.payload.data.categories,
      instruments:      req.payload.data.instruments,
      ethnicities:      req.payload.data.ethnicities

    };

    insertAndGet(newOrg);

    var toReturn = {
      org_id: orgs[0].length +1
    }

    return reply(toReturn);

      
  }//end handler  
  /* ADD COMMA ^
  validate: {
    payload: {
      name: Joi.string().required(),
      url: Joi.string().required()

   
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

  }//end postConfig
  

//delete
orgController.deleteConfig = {
  handler: function(request, reply) {
        getOrganizations();

        if (request.params.id) {
            if ((numOrgs <= request.params.id - 1) || (0 > request.params.id - 1)) {
              //return reply('Not enough users in the database for your request').code(404);
              return reply(Boom.notFound("Error with organizations DELETE endpoint"));
            }

            var query = connection.query(`
            UPDATE organizations SET is_active = false
            WHERE id = ${request.params.id}`, function(err, rows, fields) {
              if(err) {
                  return reply(Boom.badRequest(`Error while trying to DELETE organization with id=${request.params.id}...`));
              } else {
                  console.log("set organization #", request.params.id, " to innactive (is_active = false)");
              }

              getOrganizations();

              reply([{
                statusCode: 200,
                message: `organization with id=${request.params.id} set to innactive`,
              }]);
            });

        } else {
          return reply(Boom.notFound("You must specify an id as a parameter"));
        }
    }//end handler
}

module.exports = [
  	{ path: '/orgs', method: 'POST', config: orgController.postConfig},
  	{ path: '/orgs/{id?}', method: 'GET', config: orgController.getConfig },
    { path: '/orgs/{id}', method: 'DELETE', config: orgController.deleteConfig }
  ];
