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

connection.connect();

eventController = {};
var events = [];
  var numEvents = 0;
  var eventTypes = [];
  var eventTags = [];
  var eventEnsembles = [];
  var eventEthnicities = [];

getEvents();

function rowsToJS(theArray) {
  var temp = JSON.stringify(theArray);
  temp = JSON.parse(temp);
  //console.log(temp);
  return temp;
}

function getEvents() {
  //get events from db
  connection.query('SELECT * FROM events', function(err, rows, fields) {
    if (!err) {

      eventEnsembles = [];
      eventEthnicities = [];

      var JSObj = rowsToJS(rows);
      events.push(JSObj);

      numEvents = events[0].length;

      getInter("Ensembles",   "events", "event_ensembles", "ensemble_id", "event_id", eventEnsembles, numEvents );
      getInter("Ethnicities", "events", "event_ethnicities", "ethnicity_id", "event_id", eventEthnicities, numEvents );


    }
    else
      console.log('Error while performing Events Query.');

  });
}//end getEvents function
//
//

/*
================================================================================
================================================================================
 - FOR INSERTING INTO EVENTS AND MIDDLE TABLES
================================================================================
================================================================================
*/
function insertEvent(theObj) {

  var justEvent = JSON.parse(JSON.stringify(theObj));

//delete columns not stored in the events table!
  if(typeof justEvent.ethnicities !== "undefined") { delete justEvent.ethnicities; }
  if(typeof justEvent.ensembles !== "undefined") { delete justEvent.ensembles; }

// TYPE CONVERSION
  if(typeof justEvent.hymn_soc_member == "string") {
    if(justEvent.hymn_soc_member == "no" || justEvent.hymn_soc_member == "No") {
      justEvent.hymn_soc_member = false;
    } else {
      justEvent.hymn_soc_member = true;
    }
  } else if(typeof justEvent.hymn_soc_member == "number") {
    if(justEvent.hymn_soc_member == 0) {
      justEvent.hymn_soc_member = false;
    } else {
      justEvent.hymn_soc_member = true;
    }
  } else {
    //neither a string nor Number
    justEvent.hymn_soc_member = false;
  }


// END TYPE CONVERSION

	connection.query(`INSERT INTO events set ?`, justEvent, function(err, rows, fields) {
        if(err) { throw err; }

        var JSObj = rowsToJS(theObj);

        events[0].push(JSObj);

        //console.log("ethnicities length: ", Object.keys(theObj.ethnicities).length);

        //console.log("FIRST KEY IN ETHNICITIES: ",Object.keys(theObj.ethnicities)[0]);

        //var ethlength = Object.keys(theObj.ethnicities).length;

      //for multiple ethnicities

        if("ethnicities" in theObj && typeof theObj.ethnicities !== "undefined" && typeof theObj.ethnicities !== "null") {
          for(var i=0; i< Object.keys(theObj.ethnicities).length; i++) {
            getID_left(theObj, i, "Ethnicities", "ethnicity_id");
          }
        } else { console.log("No ethnicities passed in..."); }
        
        if("ensembles" in theObj && typeof theObj.ensembles !== "undefined" && typeof theObj.ensembles !== "null") {
          for(var i=0; i< Object.keys(theObj.ensembles).length; i++) {
            getID_left(theObj, i, "Ensembles", "ensemble_id");

            if(i == Object.keys(theObj.ensembles).length - 1) {
                getEvents();
              }
          }
        } else { console.log("No instruments passed in..."); getEvents();} 
        
        
    });
}

function getID_left(theObj, whichIndex, tableName, left_table_id) {
  //console.log("1: ", tableName );

	switch(tableName) {

		case "Ethnicities":
      checkIfTrue("ethnicities", theObj, whichIndex, tableName, left_table_id);
      break;
		case "Ensembles":
      checkIfTrue("ensembles", theObj, whichIndex, tableName, left_table_id);
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
      var midTable = "event_ethnicities";
      var toInsert = {ethnicity_id: theID, event_id: events[0].length}; break;
    case "Ensembles":
      var midTable = "event_ensembles";
      var toInsert = {ensemble_id: theID, event_id: events[0].length}; break;
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
 - END OF INSERTING INTO EVENTS AND MIDDLE TABLES
================================================================================
================================================================================
*/


//
//test: Method for querying intermediate tables:
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
- EVENT Controllers -
===================================================
*/

function formatEvent(actualIndex) {
  var eventData = {};

  eventData = {
    id:             events[0][actualIndex].id,
    title:          events[0][actualIndex].name,
    frequency:      events[0][actualIndex].frequency,
    url:            events[0][actualIndex].website,
    parent:         events[0][actualIndex].parent_org_id,
    //topic:          events[0][actualIndex].topic,
    //topic:         eventTypes[actualIndex],
    description:    events[0][actualIndex].description,
    event_date:     events[0][actualIndex].event_date,
    cost:           events[0][actualIndex].cost,
    //tag id's
    //tags:           eventTags[actualIndex],
    city:        	events[0][actualIndex].city,
    state:       	events[0][actualIndex].state,
    country:     	events[0][actualIndex].country,
    hymn_soc_member:events[0][actualIndex].hymn_soc_member,
    is_active:      events[0][actualIndex].is_active,
    high_level:     events[0][actualIndex].high_level,
    user_id:        events[0][actualIndex].user_id,
    user:           events[0][actualIndex].user,
    theme:          events[0][actualIndex].theme,
    shape:          events[0][actualIndex].shape,
    priest_attire:  events[0][actualIndex].priest_attire,
    attendance:     events[0][actualIndex].attendance,
    ethnicities:    eventEthnicities[actualIndex],
    ensembles:      eventEnsembles[actualIndex]


  };

  var theUrl = "/event/" + Number(actualIndex+1);

  var finalObj = {
    url: theUrl,
    data: eventData
  };

  return finalObj;
}

//EVENT GET REQUEST
eventController.getConfig = {
  handler: function (request, reply) {

      getEvents();

    if (request.params.id) {
      //if (resources.length <= request.params.id - 1) return reply('Not enough events in the database for your request').code(404);
      if ((numEvents <= request.params.id - 1) || (0 > request.params.id - 1)) {
          //return reply('Not enough resources in the database for your request').code(404);
          return reply(Boom.notFound("Index out of range for Events get request"));
      }

      var actualIndex = Number(request.params.id) - 1;
      //
      //create new object, convert to json
      var finalObj = formatEvent(actualIndex);

      return reply(finalObj);

      //return reply(events[actualId]);
    }
    //if no ID specified
    //reply(JSON.stringify(events[0]));

    var objToReturn = [];

    for(var i=0; i < events[0].length; i++) {
      var bob = formatEvent(i);
      objToReturn.push(bob);
    }

    reply(objToReturn);
  }
};

//BELOW is for the POST request
function insertFirst(toInsert, _callback){

    insertEvent(toInsert);

    _callback();    
}

function insertAndGet(toInsert){

    insertFirst(toInsert, function() {
        getEvents();
        //console.log("Done with post requst getEvents...");
    });    
}

//EVENT POST REQUEST
eventController.postConfig = {

  handler: function(req, reply) {

    //console.log("\nRECEIVED :", req.payload.data);

    getEvents();

    var theEventID = events.length+1;

    var newEvent = {
      name: 		   req.payload.data.title,
      frequency:   req.payload.data.frequency,
      website: 		 req.payload.data.url,
      parent:       req.payload.data.parent,
      description: req.payload.data.description,
      event_date:  req.payload.data.event_date,
      cost: 		    req.payload.data.cost,
      city: 		    req.payload.data.city,
      state: 		    req.payload.data.state,
      country: 		  req.payload.data.country,
      hymn_soc_member:req.payload.data.hymn_soc_member,
      user_id:      req.payload.uid,
      user:         req.payload.user,
      theme:        req.payload.data.theme,
      shape:        req.payload.data.shape,
      priest_attire:req.payload.data.priest_attire,
      attendance:   req.payload.data.attendance,
      ethnicities:  req.payload.data.ethnicities,
      ensembles:    req.payload.data.ensembles

    };

    var fixedDate = new Date().toISOString().slice(0, 10);

    newEvent.event_date = fixedDate;

    insertAndGet(newEvent);

    var toReturn = {

    	event_id: events[0].length +1 /* +1 or not?... */
    }

    return reply(toReturn);



    //reply(newRes);
  }
  /* REMOVE COMMA ^
  validate: {
    payload: {
      title: Joi.string().required(),
      url: Joi.string().required(),
      description: Joi.string().required(),
      topic: Joi.string().required()
    }
  }
  */

};

//delete
eventController.deleteConfig = {
  handler: function(request, reply) {
        getEvents();

        if (request.params.id) {
            if ((numEvents <= request.params.id - 1) || (0 > request.params.id - 1)) {
              //return reply('Not enough users in the database for your request').code(404);
              return reply(Boom.notFound("Error with events DELETE endpoint"));
            }

            var query = connection.query(`
            UPDATE events SET is_active = false
            WHERE id = ${request.params.id}`, function(err, rows, fields) {
              if(err) {
                  return reply(Boom.badRequest(`Error while trying to DELETE events with id=${request.params.id}...`));
              } else {
                  console.log("set event #", request.params.id, " to innactive (is_active = false)");
              }

              getEvents();

              reply([{
                statusCode: 200,
                message: `Event with id=${request.params.id} set to innactive`,
              }]);
            });

        } else {
          return reply(Boom.notFound("You must specify an id as a parameter"));
        }
    }//end handler
}

module.exports = [
  	{ path: '/event', method: 'POST', config: eventController.postConfig },
  	{ path: '/event/{id?}', method: 'GET', config: eventController.getConfig },
    { path: '/event/{id}', method: 'DELETE', config: eventController.deleteConfig }
];
