var Joi = require('joi');
var mysql = require('mysql');
var Boom = require('boom');

var options = require('../../config/config.js');

//mysql connection
var connection = mysql.createConnection({
    host: options.host,
    user: options.user,
    password: options.password,
    database: options.database,
    port: options.port

});

//connection.connect();

eventController = {};
var events = [];
var numEvents = 0;
var eventTags, eventTags_all = [];
var eventEnsembles, eventEnsembles_all = [];
var eventEthnicities, eventEthnicities_all = [];
var eventShape, eventShape_all = [];
var eventsAttire, eventsAttire_all = [];

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
            eventTags = [];
            eventEnsembles = [];
            eventEthnicities = [];
            eventShape = [];
            eventsAttire = [];

            events = JSObj;
            numEvents = events.length;

            for (var i = 0; i < JSObj.length; i++) {
                popArray(JSObj[i]["ethnicities"], eventEthnicities);
                popArray(JSObj[i]["ensembles"], eventEnsembles);
                popArray(JSObj[i]["tags"], eventTags);
                popArray(JSObj[i]["shape"], eventShape);
                popArray(JSObj[i]["clothing"], eventsAttire);

                //console.log("\nETH[",i, "] : ", resEth[i]);
                //console.log("\nCAT[",i, "] : ", resCategories[i]);
                //console.log("\nTOPICS[",i, "] : ", resTopics[i]);
                //console.log("\nACC[",i, "] : ", resAcc[i]);
                //console.log("\nLANG[",i, "] : ", resLanguages[i]);
                //console.log("\nENSEMBLES[",i, "] : ", resEnsembles[i]);
                //console.log("\nresTags[",i, "] : ", resTags[i]);

                eventShape_all.push(eventShape);
                eventTags_all.push(eventTags);
                eventEnsembles_all.push(eventEnsembles);
                eventEthnicities_all.push(eventEthnicities);
                eventsAttire_all.push(eventsAttire);
            }

        } else
            console.log('Error while performing events Query.');

    });
}

//Object.keys(obj.ethnicities).length
function popArray(obj, whichArray) {

    obj = JSON.parse(obj);
    if (obj == null) {
        whichArray.push([]);
        return;
    }
    //console.log("after: ",  typeof obj, ": ", obj);
    var theKeys = [];

    if (obj[0] !== undefined) {
        for (i in obj) {
            theKeys.push(obj[i]);
        }
        whichArray.push(theKeys);
        return;
    }

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {

            var theVal = obj[key]; //the corresponding value to the key:value pair that is either true, false, or a string

            if (key == 'Other' || key == 'other') {
                theKeys.push(obj[key]);
            } else if (theVal == 'True' || theVal == true || theVal == 'true' || theVal == 1) {
                key = key.replace(/_/g, " ");
                theKeys.push(key);
            } else {
                //false, dont add...
                //console.log("false for ", key, ", dont push");
            }
        }
    }

    whichArray.push(theKeys);
    //console.log("whichArray: ", whichArray);

}

function insertEvent(theObj) {

    var justEvent = JSON.parse(JSON.stringify(theObj));

    justEvent.ethnicities = JSON.stringify(justEvent.ethnicities);
    justEvent.tags = JSON.stringify(justEvent.tags);
    justEvent.ensembles = JSON.stringify(justEvent.ensembles);
    justEvent.shape = JSON.stringify(justEvent.shape);
    justEvent.clothing = JSON.stringify(justEvent.clothing);

    //console.log("\n\njustEvent: \n\n", justEvent);

    // TYPE CONVERSION
    if (typeof justEvent.hymn_soc_member == "string" || justEvent.hymn_soc_member !== undefined) {
        if (justEvent.hymn_soc_member == "no" || justEvent.hymn_soc_member == "false" || justEvent.hymn_soc_member == "False") {
            justEvent.hymn_soc_member = 0;
        } else if (justEvent.hymn_soc_member == "Yes" || justEvent.hymn_soc_member == "yes" || justEvent.hymn_soc_member == "True" || justEvent.hymn_soc_member == "true") {
            justEvent.hymn_soc_member = 1;
        } else {
            justEvent.hymn_soc_member = 0;
        }
    }

    if (justEvent.is_free !== "undefined" || justEvent.is_free !== undefined) {
        if (typeof justEvent.is_free == "string") {
            if (justEvent.is_free == "yes" || justEvent.is_free == "Yes") {
                justEvent.is_free = 1;
            } else if (justEvent.is_free == "no" || justEvent.is_free == "No") {
                justEvent.is_free = 0;
            } else {
                justEvent.is_free = 2;
            }
        } else if (typeof justEvent.is_free !== "number") {
            justEvent.is_free = 2;
        }
    }

    if (typeof justEvent.cost !== "string") {
        justEvent.cost = '' + justEvent.cost;
    }


    // END TYPE CONVERSION

    connection.query(`INSERT INTO events set ?`, justEvent, function(err, rows, fields) {
        if (err) { console.log(Boom.badRequest('invalid query inserting into events')); throw err; }

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
        id: events[actualIndex].id,
        title: events[actualIndex].name,
        frequency: events[actualIndex].frequency,
        url: events[actualIndex].website,
        parent: events[actualIndex].parent,
        theme: events[actualIndex].theme,
        description: events[actualIndex].description,
        event_date: events[actualIndex].event_date,
        event_end_date: events[actualIndex].event_end_date,
        cost: events[actualIndex].cost,
        city: events[actualIndex].city,
        state: events[actualIndex].state,
        country: events[actualIndex].country,
        hymn_soc_member: events[actualIndex].hymn_soc_member,
        is_active: events[actualIndex].is_active,
        is_free: events[actualIndex].is_free,
        high_level: events[actualIndex].high_level,
        user_id: events[actualIndex].user_id,
        user: events[actualIndex].user,
        attendance: events[actualIndex].attendance,
        approved: events[actualIndex].approved,
        pract_schol: events[actualIndex].pract_schol,
        type: events[actualIndex].type,

        clothing: eventsAttire_all[0][actualIndex],
        shape: eventShape_all[0][actualIndex],
        ethnicities: eventEthnicities_all[0][actualIndex],
        ensembles: eventEnsembles_all[0][actualIndex],
        tags: eventTags_all[0][actualIndex]


    };

    eventData.hymn_soc_member = reformatTinyInt(eventData.hymn_soc_member);
    eventData.is_active = reformatTinyInt(eventData.is_active);
    eventData.is_free = reformatTinyInt(eventData.is_free);
    eventData.high_level = reformatTinyInt(eventData.high_level);
    eventData.approved = reformatTinyInt(eventData.approved);
    eventData.pract_schol = reformatTinyInt(eventData.pract_schol);


    /*
      eventData.ethnicities = JSON.parse(eventData.ethnicities);
      eventData.tags = JSON.parse(eventData.tags);
      eventData.ensembles = JSON.parse(eventData.ensembles);
    */
    var theUrl = "/event/" + String(events[actualIndex].id);

    var finalObj = {
        url: theUrl,
        data: eventData
    };

    return finalObj;
};

function reformatTinyInt(toFormat) {
    if (toFormat == 1) {
        return ("true");
    } else if (toFormat == 0) {
        return ("false");
    } else if (toFormat == 2) {
        return ("partially");
    } else {
        return (toFormat);
    }
}

//EVENT GET REQUEST
eventController.getConfig = {
    handler: function(request, reply) {

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
                if (events[actualIndex].approved == false || events[actualIndex].approved == 0) {
                    var str = formatEvent(actualIndex);
                    return reply(str);
                } else {
                    return reply(Boom.badRequest("The Event you request is already approved"));
                }

                //return reply(events[actualId]);
            }
            //if no ID specified
            var objToReturn = [];

            for (var i = 0; i < events.length; i++) {
                //var bob = formatevent(i);
                if (events[i].approved == 0) {
                    var str = {
                        id: events[i].id,
                        user: events[i].user,
                        title: events[i].name
                    }
                    objToReturn.push(str);
                }


            } //end for

            //console.log(objToReturn);
            if (objToReturn.length <= 0) {
                return reply(Boom.badRequest("All events already approved, nothing to return"));
            } else {
                reply(objToReturn);
            }


        } //end handler
};


//BELOW is for the POST request
function insertFirst(toInsert, _callback) {

    insertEvent(toInsert);

    _callback();
}

function insertAndGet(toInsert, callback) {

    insertFirst(toInsert, function() {
        connection.query(`SELECT * from events`, function(err, rows, fields) {
            if (err) { callback(err, null); }

            var JSObj = rowsToJS(rows);

            callback(null, JSObj[JSObj.length - 1].id); //get the last element's id

        });

    });
}


//EVENT POST REQUEST
eventController.postConfig = {
    //auth: 'high_or_admin',
    handler: function(req, reply) {

            //console.log("\nRECEIVED :", req.payload.data);

            //getEventsJSON();

            var theEventID = events.length + 1;

            var newEvent = {
                name: req.payload.data.title,
                frequency: req.payload.data.occurance,
                website: req.payload.data.url,
                parent: req.payload.data.parent,
                description: req.payload.data.description,
                event_date: req.payload.data.event_start_date,
                event_end_date: req.payload.data.event_end_date,
                cost: req.payload.data.cost,
                city: req.payload.data.city,
                state: req.payload.data.state,
                country: req.payload.data.country,
                hymn_soc_member: req.payload.data.hymn_soc_member,
                user_id: req.payload.uid,
                user: req.payload.user,
                theme: req.payload.data.theme,
                shape: req.payload.data.shape,
                clothing: req.payload.data.clothing,
                attendance: req.payload.data.attendance,
                approved: req.payload.data.approved,
                pract_schol: req.payload.data.pract_schol,
                is_free: req.payload.data.is_free,
                is_active: true,
                type: req.payload.data.type,

                ethnicities: req.payload.data.ethnicities,
                ensembles: req.payload.data.ensembles,
                tags: req.payload.data.tags

            };

            if (newEvent.event_date == "" || newEvent.event_date == " ") {
                newEvent.event_date = null;
            }
            if (newEvent.event_end_date == "" || newEvent.event_end_date == " ") {
                newEvent.event_end_date = null;
            }

            // DATE FORMATTING
            if (newEvent.event_date !== null) {
                var fixed_date_1 = newEvent.event_date.toString().slice(0, 4);
                var fixed_date_2 = newEvent.event_date.toString().slice(5, 7);
                var fixed_date_3 = newEvent.event_date.toString().slice(8, 10);
                var fixed_date_4 = newEvent.event_date.toString().slice(11, 13);
                var fixed_date_5 = newEvent.event_date.toString().slice(14, 16);
                var fixed_date_6 = newEvent.event_date.toString().slice(17, 19);

                newEvent.event_date = "";
                var str = newEvent.event_date.concat(fixed_date_1, fixed_date_2, fixed_date_3,
                    fixed_date_4, fixed_date_5, fixed_date_6);
                newEvent.event_date = str;
            }

            if (newEvent.event_end_date !== null) {
                var fixed_date_1 = newEvent.event_end_date.toString().slice(0, 4);
                var fixed_date_2 = newEvent.event_end_date.toString().slice(5, 7);
                var fixed_date_3 = newEvent.event_end_date.toString().slice(8, 10);
                var fixed_date_4 = newEvent.event_end_date.toString().slice(11, 13);
                var fixed_date_5 = newEvent.event_end_date.toString().slice(14, 16);
                var fixed_date_6 = newEvent.event_end_date.toString().slice(17, 19);

                newEvent.event_end_date = "";
                var str = newEvent.event_end_date.concat(fixed_date_1, fixed_date_2, fixed_date_3,
                    fixed_date_4, fixed_date_5, fixed_date_6);
                newEvent.event_end_date = str;
            }
            // END DATE FORMATTING


            insertAndGet(newEvent, (err, theID) => {
                var toReturn = {

                    event_id: theID
                }

                return reply(toReturn);
            });

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
    //auth: 'admin_only',
    handler: function(req, reply) {
            var query = connection.query(`DELETE FROM events WHERE id=${req.params.id}`, function(err, rows, fields) {
                if (err) { return reply(Boom.badRequest("error when deleting from events")); }
                return reply({
                    code: 202,
                    message: `Successfully deleted events with id=${req.params.id}`
                });
            });
        } //end handler
};

eventController.updateConfig = {
    //auth: 'admin_only',
    handler: function(request, reply) {
            getEventsJSON();

            if (request.params.id) {
                if (numEvents <= request.params.id - 1) {
                    //return reply('Not enough events in the database for your request').code(404);
                    return reply(Boom.notFound("Not enough events"));
                }
                //if (events.length <= request.params.id - 1) return reply('Not enough events in the database for your request').code(404);
                var actualIndex = Number(request.params.id - 1); //if you request for events/1 you'll get events[0]

                var mysqlIndex = Number(request.params.id);

                var theCol = request.payload.column;
                var theVal = request.payload.value;

                if (theCol == "id") { return reply(Boom.unauthorized("cannot change that...")); }

                var query = connection.query(`
            UPDATE events SET ?
            WHERE ?`, [{
                    [theCol]: theVal
                }, { id: mysqlIndex }], function(err, rows, fields) {
                    if (err) {
                        console.log(query.sql);
                        return reply(Boom.badRequest(`invalid query when updating events on column ${request.payload.what_var} with value = ${request.payload.what_val} `));
                    } else {
                        getEventsJSON();
                        console.log(query.sql);
                        console.log("set event #", mysqlIndex, ` variable ${theCol} = ${theVal}`);
                    }

                    return reply({ statusCode: 200 });
                });

                //return reply(events[actualId]);
            }
        } //handler
};

//EVENT GET REQUEST
eventController.getApprovedConfig = {
    handler: function(request, reply) {

            connection.query(`SELECT * from events`, function(err, rows, fields) {
                if (err) { return reply(Boom.badRequest()); }
                if (!err) {

                    var JSObj = rowsToJS(rows);

                    events = [];
                    numEvents = 0;
                    eventTags = [];
                    eventEnsembles = [];
                    eventEthnicities = [];
                    eventShape = [];
                    eventsAttire = [];

                    events = JSObj;
                    numEvents = events.length;

                    for (var i = 0; i < JSObj.length; i++) {
                        popArray(JSObj[i]["ethnicities"], eventEthnicities);
                        popArray(JSObj[i]["ensembles"], eventEnsembles);
                        popArray(JSObj[i]["tags"], eventTags);
                        popArray(JSObj[i]["shape"], eventShape);
                        popArray(JSObj[i]["clothing"], eventsAttire);

                        eventShape_all.push(eventShape);
                        eventTags_all.push(eventTags);
                        eventEnsembles_all.push(eventEnsembles);
                        eventEthnicities_all.push(eventEthnicities);
                        eventsAttire_all.push(eventsAttire);
                    }


                    if (request.params.id) {
                        //if (events.length <= request.params.id - 1) return reply('Not enough events in the database for your request').code(404);


                        var actualIndex = Number(request.params.id) - 1;
                        //
                        //create new object, convert to json  
                        if (events[actualIndex].approved == 1) {
                            var str = formatEvent(actualIndex);
                            return reply(str);
                        } else {
                            return reply(Boom.badRequest("The Event you request is already approved"));
                        }

                        //return reply(events[actualId]);
                    }
                    //if no ID specified
                    var objToReturn = [];

                    for (var i = 0; i < events.length; i++) {
                        //var bob = formatevent(i);
                        if (events[i].approved == 1) {
                            var str = formatEvent(i);
                            objToReturn.push(str);
                        }


                    } //end for

                    //console.log(objToReturn);
                    if (objToReturn.length <= 0) {
                        return reply(Boom.badRequest("nothing to return, nothing is approved"));
                    } else {
                        reply(objToReturn);
                    }
                }
            });
        } //end handler
};

eventController.editConfig = {
    //auth: 'high_or_admin',
    handler: function(req, reply) {

        var newEvent = {
            name: req.payload.data.title, //
            frequency: req.payload.data.occurance,
            website: req.payload.data.url,
            parent: req.payload.data.parent,
            description: req.payload.data.description,
            event_date: req.payload.data.event_start_date,
            event_end_date: req.payload.data.event_end_date,
            cost: req.payload.data.cost,
            city: req.payload.data.city,
            state: req.payload.data.state,
            country: req.payload.data.country,
            hymn_soc_member: req.payload.data.hymn_soc_member,
            user_id: req.payload.uid,
            user: req.payload.user,
            theme: req.payload.data.theme,
            shape: req.payload.data.shape,
            clothing: req.payload.data.clothing,
            attendance: req.payload.data.attendance,
            approved: req.payload.data.approved,
            pract_schol: req.payload.data.pract_schol,
            is_free: req.payload.data.is_free,
            is_active: true,
            type: req.payload.data.type,

            approved: false,
            ethnicities: req.payload.data.ethnicities,
            ensembles: req.payload.data.ensembles,
            tags: req.payload.data.tags

        };

        if (newEvent.event_date == "" || newEvent.event_date == " ") {
            newEvent.event_date = null;
        }
        if (newEvent.event_end_date == "" || newEvent.event_end_date == " ") {
            newEvent.event_end_date = null;
        }

        // DATE FORMATTING
        if (newEvent.event_date !== undefined) {
            var fixed_date_1 = newEvent.event_date.toString().slice(0, 4);
            var fixed_date_2 = newEvent.event_date.toString().slice(5, 7);
            var fixed_date_3 = newEvent.event_date.toString().slice(8, 10);
            var fixed_date_4 = newEvent.event_date.toString().slice(11, 13);
            var fixed_date_5 = newEvent.event_date.toString().slice(14, 16);
            var fixed_date_6 = newEvent.event_date.toString().slice(17, 19);

            newEvent.event_date = "";
            var str = newEvent.event_date.concat(fixed_date_1, fixed_date_2, fixed_date_3,
                fixed_date_4, fixed_date_5, fixed_date_6);
            newEvent.event_date = str;
        }

        if (newEvent.event_end_date !== undefined) {
            var fixed_date_1 = newEvent.event_end_date.toString().slice(0, 4);
            var fixed_date_2 = newEvent.event_end_date.toString().slice(5, 7);
            var fixed_date_3 = newEvent.event_end_date.toString().slice(8, 10);
            var fixed_date_4 = newEvent.event_end_date.toString().slice(11, 13);
            var fixed_date_5 = newEvent.event_end_date.toString().slice(14, 16);
            var fixed_date_6 = newEvent.event_end_date.toString().slice(17, 19);

            newEvent.event_end_date = "";
            var str = newEvent.event_end_date.concat(fixed_date_1, fixed_date_2, fixed_date_3,
                fixed_date_4, fixed_date_5, fixed_date_6);
            newEvent.event_end_date = str;
        }
        // END DATE FORMATTING

        var justEvent = JSON.parse(JSON.stringify(newEvent));

        justEvent.ethnicities = JSON.stringify(justEvent.ethnicities);
        justEvent.tags = JSON.stringify(justEvent.tags);
        justEvent.ensembles = JSON.stringify(justEvent.ensembles);
        justEvent.shape = JSON.stringify(justEvent.shape);
        justEvent.clothing = JSON.stringify(justEvent.clothing);

        //console.log("\n\njustEvent: \n\n", justEvent);

        // TYPE CONVERSION
        if (typeof justEvent.hymn_soc_member == "string") {
            if (justEvent.hymn_soc_member == "no" || justEvent.hymn_soc_member == "No" || justEvent.hymn_soc_member == "false" || justEvent.hymn_soc_member == "False") {
                justEvent.hymn_soc_member = 0;
            } else if (justEvent.hymn_soc_member == "partially" || justEvent.hymn_soc_member == "Partially") {
                justEvent.hymn_soc_member = 2;
            } else {
                justEvent.hymn_soc_member = 1;
            }
        } else if (typeof justEvent.hymn_soc_member !== "number") {
            justEvent.hymn_soc_member = 2;
        }

        if (typeof justEvent.is_free == "string") {
            if (justEvent.is_free == "no" || justEvent.is_free == "No" || justEvent.is_free == "False" || justEvent.is_free == "false") {
                justEvent.is_free = 0;
            } else if (justEvent.is_free == "yes" || justEvent.is_free == "Yes" || justEvent.is_free == "True" || justEvent.is_free == "true") {
                justEvent.is_free = 1;
            } else {
                justEvent.is_free = 2;
            }
        } else {
            justEvent.is_free = 0;
        }

        if (typeof justEvent.cost !== "string") {
            justEvent.cost = '' + justEvent.cost;
        }

        // END TYPE CONVERSION
        var query = connection.query(`
      UPDATE events SET ?
      WHERE ?`, [justEvent, { id: req.params.id }], function(err, rows, fields) {
            if (err) {
                return reply(Boom.badRequest(`invalid query when updating events with id = ${req.params.id} `));
            } else {
                //console.log("edited event #", req.params.id);
            }

            return reply({ statusCode: 201 });
        });


    }
};

eventController.addTagConfig = {
    //auth:
    handler: function(request, reply) {
        connection.query(`SELECT id FROM events`, (err, rows, fields) => {
            if (err) { return reply(Boom.badRequest("error selecting events in updateConfig")); }
            if (request.params.id) {

                //console.log("request.payload.tag: ", request.payload.tag);
                var receivedtag = request.payload.tag; //receive tag from body, parse to JSObj

                //get existing tag
                connection.query(`SELECT tags FROM events WHERE id = ?`, [request.params.id], (err, rows, fields) => {
                    if (err) { return reply(Boom.badRequest("error selecting tag from event")); }
                    //console.log("rows[0]: ", rowsToJS(rows[0].tag));
                    if (rowsToJS(rows[0].tags) !== null) {
                        var currenttag = JSON.parse(rows[0].tags);
                    } else {
                        var currenttag = [];
                    }

                    currenttag.push(receivedtag);

                    connection.query(`UPDATE events SET tags = ? WHERE id = ?`, [JSON.stringify(currenttag), request.params.id], (err, rows, fields) => {
                        if (err) { return reply(Boom.badRequest("error adding tag to event")); }
                        return reply({ statusCode: 201 });

                    });

                });



            } else {
                return reply(Boom.notFound("must supply and id as a parameter"));

            }
        });
    }

};

//var postQuizController = require('../../controllers/events/post-quiz-event').postQuiz;

var postQuizController = require('../../controllers/post-quiz-then-get').postQuizEvents;
var getUnapprovedRes = require('../../controllers/events/get-events').getUnapprovedevents;
var getApprovedRes = require('../../controllers/events/get-events').getApprovedevents;

module.exports = [
    { path: '/event', method: 'POST', config: eventController.postConfig },
    { path: '/event/{id?}', method: 'GET', config: getUnapprovedRes },
    { path: '/event/approved/{id?}', method: 'GET', config: getApprovedRes },
    { path: '/event/{id}', method: 'DELETE', config: eventController.deleteConfig },
    { path: '/event/{id}', method: 'PUT', config: eventController.editConfig },
    { path: '/event/update/{id}', method: 'PUT', config: eventController.updateConfig },
    { path: '/quiz/event', method: 'POST', config: postQuizController },
    { path: '/event/addtag/{id}', method: 'PUT', config: eventController.addTagConfig }


];