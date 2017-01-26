var Joi = require('joi')
var mysql = require('mysql')

var options = require('../../config/config.js');

//mysql connection
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : options.user,
  password : options.password,
  database : options.database
});

connection.connect();

eventController = {};
var events = [];
  var numEvents = 0;
  var eventTypes = [];
  var eventTags = [];

getEvents();

function rowsToJS(theArray) {
  var temp = JSON.stringify(theArray);
  temp = JSON.parse(temp);
  //console.log(temp);
  return temp;
}

function getEvents() {
  //get events from db
  connection.query('SELECT * from events', function(err, rows, fields) {
    if (!err) {
      //console.log('The solution is: ', rows);
      //console.log(rows[0].first_name, rows[0].last_name);
      //console.log(rows);
      
      //events.push(rows);
  /*
      var str = JSON.stringify(rows);
      var finalData = str.replace(/\\/g, "");
  */
      var JSObj = rowsToJS(rows);       
      events.push(JSObj);

      numEvents = events[0].length;

      getInter("Event_Types", "events", "event_event_types", "event_type_id", "event_id", eventTypes, numEvents );
      getInter("Tags", "events", "event_tags", "tag_id", "event_id", eventTags, numEvents );


    }
    else
      console.log('Error while performing Events Query.');

  });
}//end getEvents function

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
- EVENT Controllers -
=================================================== 
*/

function formatEvent(actualIndex) {
  var eventData = {};

  eventData = {
    id:             events[0][actualIndex].id, 
    title:          events[0][actualIndex].title,
    frequency:      events[0][actualIndex].frequency,
    url:            events[0][actualIndex].website,
    parent:         events[0][actualIndex].parent_org_id,
    //topic(s)
    topic:         eventTypes[actualIndex],
    description:    events[0][actualIndex].description,
    event_date:     events[0][actualIndex].event_date,
    cost:           events[0][actualIndex].cost,
    //tag id's
    tags:           eventTags[actualIndex],
    city:        	events[0][actualIndex].city,
    state:       	events[0][actualIndex].state,
    country:     	events[0][actualIndex].country,
    hymn_soc_member:events[0][actualIndex].hymn_soc_member,    
    is_active:      events[0][actualIndex].is_active,
    high_level:     events[0][actualIndex].high_level


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
    if (request.params.id) {
      //if (resources.length <= request.params.id - 1) return reply('Not enough events in the database for your request').code(404);
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

//EVENT POST REQUEST
eventController.postConfig = {
	
  handler: function(req, reply) {


    var newEvent = { 
      title: 		req.payload.title, 
      website: 		req.payload.url, 
      description: 	req.payload.description,
      theme: 		req.payload.theme,
      //parent_org_id: 		req.payload.parent_org_id,
      //topic: 		req.payload.topic,
      cost: 		req.payload.cost,
      city: 		req.payload.city,
      state: 		req.payload.state,
      country: 		req.payload.country,
      hymn_soc_member:req.payload.hymn_soc_member,
      is_active: 	req.payload.is_active,
      high_level: 	req.payload.high_level


    };

    // mysql
    //connection.connect();
    connection.query(
      'INSERT INTO events SET ?', newEvent,
      function(err, rows) {
        if(err) {
          throw new Error(err);
          return;
        }

        events[0].push(newEvent);

        reply([{
          statusCode: 200,
          message: 'Inserted Successfully',
        }]);
        
      }
    );
    //end mysql

    
    //reply(newRes);
  },
  validate: {
    payload: {
      title: Joi.string().required(),
      url: Joi.string().required(),
      description: Joi.string().required(),
      topic: Joi.string().required()
    }
  }

};

module.exports = [
  	{ path: '/event', method: 'POST', config: eventController.postConfig },
  	{ path: '/event/{id?}', method: 'GET', config: eventController.getConfig }
];