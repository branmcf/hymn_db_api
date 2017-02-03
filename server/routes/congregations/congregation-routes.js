var Joi = require('joi');
var mysql = require('mysql');
var Boom = require('boom');

//mysql connection
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123',
  database : 'testDb'
  //port     : options.port

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

      var JSObj = rowsToJS(rows);
      congs.push(JSObj);
      numCongs = congs[0].length;

      //getInter("Denominations", 	"congregations", "congregation_denominations", 		"denomination_id", 		"congregation_id", congDen, numCongs);
      //getInter("Cong_Types",    	"congregations", "congregation_types" ,				"congregation_type_id", "congregation_id", congCategories, numCongs);
      getInter("Instrument_Types", 	 "congregations", "congregation_instrument_types", 	      "instrument_type_id", 	"congregation_id", congInstr, numCongs);
      getInter("Ethnicities",  		   "congregations", "congregation_ethnicities",  		        "ethnicity_id", 			"congregation_id", congEth, numCongs);
      //getInter("Tags", 				"congregations", "congregation_tags", 				"tag_id", 				"congregation_id", congTags, numCongs);
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
function insertResource(theObj) {

  var justResource = JSON.parse(JSON.stringify(theObj));

//delete columns not stored in the resources table!
  if(typeof justResource.ethnicities !== "undefined") { delete justResource.ethnicities; }
  if(typeof justResource.categories !== "undefined") { delete justResource.categories; }
	if(typeof justResource.instruments !== "undefined") { delete justResource.instruments; }



	connection.query(`insert into congregations set ?`, justResource, function(err, rows, fields) {
        if(err) { throw err; }

        var JSObj = rowsToJS(theObj);

        congs[0].push(JSObj);

        console.log("NOW CONGREGATIONS.LENGTH IS: ", congs[0].length);

        //console.log("ethnicities length: ", Object.keys(theObj.ethnicities).length);

        //console.log("FIRST KEY IN ETHNICITIES: ",Object.keys(theObj.ethnicities)[0]);

        //var ethlength = Object.keys(theObj.ethnicities).length;

      //for multiple ethnicities
      for(var i=0; i< theObj.ethnicities.length; i++) {
      	getID_left(theObj, i, "Ethnicities", "ethnicity_id");
  	  }

    	//for multiple CATEGORIES
    	for(var i=0; i< theObj.instruments.length; i++) {
    		getID_left(theObj, i, "Instrument_Types", "instrument_type_id");

    	}

    	//for multiple TOPICS
    	for(var i=0; i< theObj.categories.length; i++) {
    		getID_left(theObj, i, "Congregation_Categories", "congregation_category_id");

    	}

        //getIDAttribute(theObj, 1);
    });
}


function getID_left(theObj, whichIndex, tableName, left_table_id) {
	console.log("done with insertResource()");

	switch(tableName) {

		case "Ethnicities":
      var attributeName = theObj.ethnicities[whichIndex];
			break;
		case "Congregation_Categories":
			//var attributeName = theObj.categories[whichIndex].name;
      var attributeName = theObj.categories[whichIndex];
			break;
		case "Instrument_Types":
			var attributeName = theObj.instruments[whichIndex];
			break;
		default:
			console.log("INVALID TABLE NAME SENT for ",tableName);
			break;
	}//end switch

	console.log("attributeName:", attributeName);

	var mid_table_id = 0;

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

function insertMiddle(theID, tableName, left_table_id) {
	//2b. insert into middle table
	//console.log("\nABOUT TO INSERT FOR RESOURCE #", resources[0].length, "\n");
	switch(tableName) {
		case "Ethnicities":
			var midTable = "congregation_ethnicities";
			var toInsert = {ethnicity_id: theID, congregation_id: congs[0].length};	break;
		case "Congregation_Categories":
			var midTable = "congregation_congregation_categories";
			var toInsert = {congregation_category_id: theID, congregation_id: congs[0].length};	break;
		case "Instrument_Types":
			var midTable = "congregation_instrument_types";
			var toInsert = {instrument_type_id: theID, congregation_id: congs[0].length};	break;

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
    //tags:           congCategories[actualIndex],
    is_active:      congs[0][actualIndex].is_active,
    high_level:     congs[0][actualIndex].high_level

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
      if (numCongs <= request.params.id - 1) {
        //return reply('Not enough resources in the database for your request').code(404);
        return reply(Boom.notFound());
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
      attendance:     req.payload.data.attendance
    };

    insertResource(newCong);

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


module.exports = [
	{ path: '/congregation', method: 'POST', config: congController.postConfig },
 	{ path: '/congregation/{id?}', method: 'GET', config: congController.getConfig }

];
