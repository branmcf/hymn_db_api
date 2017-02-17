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

getEventsJSON();

function rowsToJS(theArray) {
  var temp = JSON.stringify(theArray);
  temp = JSON.parse(temp);
  //console.log(temp);
  return temp;
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
    description:    events[actualIndex].description,
    event_date:     events[actualIndex].event_date,
    event_end_date: events[actualIndex].event_end_date,
    cost:           events[actualIndex].cost,
    city:        	  events[actualIndex].city,
    state:       	  events[actualIndex].state,
    country:     	  events[actualIndex].country,
    hymn_soc_member:events[actualIndex].hymn_soc_member,
    is_active:      events[actualIndex].is_active,
    high_level:     events[actualIndex].high_level,
    user_id:        events[actualIndex].user_id,
    user:           events[actualIndex].user,
    theme:          events[actualIndex].theme,
    shape:          events[actualIndex].shape,
    clothing:       events[actualIndex].priest_attire,
    attendance:     events[actualIndex].attendance,

    ethnicities:    events[actualIndex].ethnicities,
    ensembles:      events[actualIndex].ensembles,
    tags:           events[actualIndex].tags


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
      frequency:   req.payload.data.occurance,
      website: 		 req.payload.data.url,
      parent:       req.payload.data.parent,
      description: req.payload.data.description,
      event_date:  req.payload.data.event_date,
      event_end_date: req.payload.data.event_end_date,
      cost: 		    req.payload.data.cost,
      city: 		    req.payload.data.city,
      state: 		    req.payload.data.state,
      country: 		  req.payload.data.country,
      hymn_soc_member:req.payload.data.hymn_soc_member,
      user_id:      req.payload.uid,
      user:         req.payload.user,
      theme:        req.payload.data.theme,
      shape:        req.payload.data.shape,
      priest_attire:req.payload.data.clothing,
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
