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

//connection.connect();

eventController = {};
var events = [];
  var numEvents = 0;
  var eventTypes = [];
  var eventTags = [];
  var eventEnsembles = [];
  var eventEthnicities = [];

getEventsJSON();

function rowsToJS(theArray) {
  var temp = JSON.stringify(theArray);
  temp = JSON.parse(temp);
  //console.log(temp);
  return temp;
}

function getEventsJSON() {
  //console.log("===== GETTING EVENTS =====");
  connection.query(`SELECT * from events`, function(err, rows, fields) {
    if (!err) {

      	var JSObj = rowsToJS(rows);

        events = [];
        numEvents = 0;
        eventTypes = [];
        eventTags = [];
        eventEnsembles = [];
        eventEthnicities = [];

        events = JSObj;
      	numEvents = events.length;

    }
    else
      console.log('Error while performing events Query.');

  });
}

function insertEvent(theObj) {

  var justEvent = JSON.parse(JSON.stringify(theObj));

  justEvent.ethnicities = JSON.stringify(justEvent.ethnicities);
  justEvent.tags = JSON.stringify(justEvent.tags);
  justEvent.ensembles = JSON.stringify(justEvent.ensembles);

  //console.log("\n\njustEvent: \n\n", justEvent);

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

  if(justEvent.is_free !== "undefined" || justEvent.is_free !== undefined) {
    if(typeof justEvent.is_free == "string") {
      if(justEvent.is_free == "yes" || justEvent.is_free == "Yes") {
        justEvent.is_free = 1;
      } else if(justEvent.is_free == "no" || justEvent.is_free == "No"){
        justEvent.is_free = 0;
      } else {
        justEvent.is_free = 2;
      }
    } else if(typeof justEvent.is_free !== "number") {
      justEvent.is_free = 2;
    }
  }

  if(typeof justEvent.cost !== "string") {
    justEvent.cost = '' + justEvent.cost;
  }  
    

  // END TYPE CONVERSION

	connection.query(`INSERT INTO events set ?`, justEvent, function(err, rows, fields) {
        if(err) { console.log(Boom.badRequest('invalid query inserting into events')); throw err; }

        var JSObj = rowsToJS(theObj);
        events.push(JSObj);


        
    });
}

/*
===================================================
- EVENT Controllers -
===================================================
*/

function formatEvent(actualIndex) {
  var eventData = {};

  eventData = {
    id:             events[actualIndex].id,
    title:          events[actualIndex].name,
    frequency:      events[actualIndex].frequency,
    url:            events[actualIndex].website,
    parent:         events[actualIndex].parent_org_id,
    theme:          events[actualIndex].theme,
    description:    events[actualIndex].description,
    event_date:     events[actualIndex].event_date,
    event_end_date: events[actualIndex].event_end_date,
    cost:           events[actualIndex].cost,
    city:        	  events[actualIndex].city,
    state:       	  events[actualIndex].state,
    country:     	  events[actualIndex].country,
    hymn_soc_member:events[actualIndex].hymn_soc_member,
    is_active:      events[actualIndex].is_active,
    is_free:        events[actualIndex].is_free,
    high_level:     events[actualIndex].high_level,
    user_id:        events[actualIndex].user_id,
    user:           events[actualIndex].user,
    shape:          events[actualIndex].shape,
    clothing:       events[actualIndex].priest_attire,
    attendance:     events[actualIndex].attendance,
    approved:       events[actualIndex].approved,
    pract_schol:    events[actualIndex].pract_schol,

    ethnicities:    events[actualIndex].ethnicities,
    ensembles:      events[actualIndex].ensembles,
    tags:           events[actualIndex].tags


  };

  eventData.ethnicities = JSON.parse(eventData.ethnicities);
  eventData.tags = JSON.parse(eventData.tags);
  eventData.ensembles = JSON.parse(eventData.ensembles);

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

    getEventsJSON();

    if (request.params.id) {
      //if (events.length <= request.params.id - 1) return reply('Not enough events in the database for your request').code(404);
      if ((numEvents <= request.params.id - 1) || (0 > request.params.id - 1)) {
          //return reply('Not enough events in the database for your request').code(404);
          return reply(Boom.notFound("Index out of range for Events get request"));
      }

      var actualIndex = Number(request.params.id) - 1;
      //
      //create new object, convert to json
      if(events[actualIndex].approved == false || events[actualIndex].approved == 0) {
          var str = formatEvent(actualIndex);
          return reply(str);
      } else {
          return reply(Boom.badRequest("The Event you request is already approved"));
      }

      //return reply(events[actualId]);
    }
    //if no ID specified
    var objToReturn = [];

    for(var i=0; i < events.length; i++) {
      //var bob = formatevent(i);
      if(events[i].approved == false || events[i].approved == 0) {
        var str = {
          id:     events[i].id,
          user:   events[i].user,
          title:  events[i].name
        }
        objToReturn.push(str);
      }
    }//end for

    //console.log(objToReturn);
    if(objToReturn.length <= 0) {
      return reply(Boom.badRequest("All events already approved, nothing to return"));
    } else {
      reply(objToReturn);
    }  
  
    
  }//end handler
};

//BELOW is for the POST request
function insertFirst(toInsert, _callback){

    insertEvent(toInsert);

    _callback();    
}

function insertAndGet(toInsert){

    insertFirst(toInsert, function() {
        getEventsJSON();
        //console.log("Done with post requst getEvents...");
    });    
}

//EVENT POST REQUEST
eventController.postConfig = {

  handler: function(req, reply) {

    //console.log("\nRECEIVED :", req.payload.data);

    //getEventsJSON();

    var theEventID = events.length+1;

    var newEvent = {
      name: 		      req.payload.data.title,
      frequency:      req.payload.data.occurance,
      website: 		    req.payload.data.url,
      parent:         req.payload.data.parent,
      description:    req.payload.data.description,
      event_date:     req.payload.data.event_start_date,
      event_end_date: req.payload.data.event_end_date,
      cost: 		      req.payload.data.cost,
      city: 		      req.payload.data.city,
      state: 		      req.payload.data.state,
      country: 		    req.payload.data.country,
      hymn_soc_member:req.payload.data.hymn_soc_member,
      user_id:        req.payload.uid,
      user:           req.payload.user,
      theme:          req.payload.data.theme,
      shape:          req.payload.data.shape,
      priest_attire:  req.payload.data.clothing,
      attendance:     req.payload.data.attendance,
      approved:       req.payload.data.approved,
      pract_schol:    req.payload.data.pract_schol,
      is_free:        req.payload.data.is_free,

      ethnicities:    req.payload.data.ethnicities,
      ensembles:      req.payload.data.ensembles,
      tags:           req.payload.data.tags

    };  

    if(newEvent.event_date == "" || newEvent.event_date == " ") {
      newEvent.event_date = null;
    }
    if(newEvent.event_end_date == "" || newEvent.event_end_date == " ") {
      newEvent.event_end_date = null;
    }

// DATE FORMATTING
    if(newEvent.event_date !== null) {
      var fixed_date_1 = newEvent.event_date.toString().slice(0,4);
      var fixed_date_2 = newEvent.event_date.toString().slice(5,7);
      var fixed_date_3 = newEvent.event_date.toString().slice(8,10);
      var fixed_date_4 = newEvent.event_date.toString().slice(11,13);
      var fixed_date_5 = newEvent.event_date.toString().slice(14,16);
      var fixed_date_6 = newEvent.event_date.toString().slice(17,19);

      newEvent.event_date = "";
      var str = newEvent.event_date.concat(fixed_date_1, fixed_date_2, fixed_date_3, 
      fixed_date_4, fixed_date_5, fixed_date_6);
      newEvent.event_date = str;
    }
    
    if(newEvent.event_end_date !== null) {
      var fixed_date_1 = newEvent.event_end_date.toString().slice(0,4);
      var fixed_date_2 = newEvent.event_end_date.toString().slice(5,7);
      var fixed_date_3 = newEvent.event_end_date.toString().slice(8,10);
      var fixed_date_4 = newEvent.event_end_date.toString().slice(11,13);
      var fixed_date_5 = newEvent.event_end_date.toString().slice(14,16);
      var fixed_date_6 = newEvent.event_end_date.toString().slice(17,19);

      newEvent.event_end_date = "";
      var str = newEvent.event_end_date.concat(fixed_date_1, fixed_date_2, fixed_date_3, 
      fixed_date_4, fixed_date_5, fixed_date_6);
      newEvent.event_end_date = str;
    }
// END DATE FORMATTING


    insertAndGet(newEvent);

    var toReturn = {

    	event_id: theEventID /* +1 or not?... */
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
        getEventsJSON();

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

              getEventsJSON();

              reply([{
                statusCode: 200,
                message: `Event with id=${request.params.id} set to innactive`,
              }]);
            });

        } else {
          return reply(Boom.notFound("You must specify an id as a parameter"));
        }
    }//end handler
};

eventController.activateConfig = {
    handler: function(request, reply) {
        getEventsJSON();
      	var theeventID = events.length+1;

        if (request.params.id) {
            if (numEvents <= request.params.id - 1) {
              //return reply('Not enough events in the database for your request').code(404);
              return reply(Boom.notFound("Not enough events"));
            }
            //if (events.length <= request.params.id - 1) return reply('Not enough events in the database for your request').code(404);
            var actualIndex = Number(request.params.id -1 );  //if you request for events/1 you'll get events[0]

            var mysqlIndex = Number(request.params.id);

            var theCol = request.params.what_var;
            var theVal = request.params.what_val;

            var query = connection.query(`
            UPDATE events SET ?
            WHERE ?`, [{ [theCol]: theVal}, {id: mysqlIndex}],function(err, rows, fields) {
              if(err) {
                  console.log(query.sql);
                  return reply(Boom.badRequest(`invalid query when updating events on column ${request.params.what_var} with value = ${request.params.what_val} `));
              } else {
                console.log(query.sql);
                console.log("set event #", mysqlIndex, ` variable ${theCol} = ${theVal}`);
              }

              return reply( {code: 201} );
            });

          //return reply(events[actualId]);
        }
    }//handler
}


module.exports = [
  	{ path: '/event', method: 'POST', config: eventController.postConfig },
  	{ path: '/event/{id?}', method: 'GET', config: eventController.getConfig },
    { path: '/event/{id}', method: 'DELETE', config: eventController.deleteConfig },
    { path: '/event/{what_var}/{what_val}/{id}', method: 'PUT', config: eventController.activateConfig}
];
