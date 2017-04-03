var Joi = require('joi');
var mysql = require('mysql');
var Boom = require('boom');
var async = require('async');

var options = require('../../config/config.js');

//mysql connection
var connection = mysql.createConnection({
    host: options.host,
    user: options.user,
    password: options.password,
    database: options.database,
    port: options.port

});

if (process.env.JAWSDB_URL) {
    connection = mysql.createConnection(process.env.JAWSDB_URL);
}

function rowsToJS(theArray) {
    var temp = JSON.stringify(theArray);
    temp = JSON.parse(temp);
    //console.log(temp);
    return temp;
}


function formatJSON(event) {
    var json_columns = ["topics", "ensembles", "accompaniment", "languages", "categories", "ethnicities", "instruments", "tags", "clothing", "shape"];
    for (var i in json_columns) {
        if (event[json_columns[i]]) { //if it exists...
            event[json_columns[i]] = JSON.parse(event[json_columns[i]]);


        } else {
            //console.log("error, ", json_columns[i], " doesn't exist in event");
        }


    }

    //return the JSON columns in an array
    var theKeys = [];

    //loop through every column, check if it's true
    for (var col_index in json_columns) {
        if (event[json_columns[col_index]]) { //if it exists...
            var current_obj = event[json_columns[col_index]];
            for (var key in current_obj) { //if key is in the current object...
                if (current_obj.hasOwnProperty(key)) {
                    var TorForOther = current_obj[key]; //the corresponding value to the key:value pair which is either T,F or TorForOther
                    if (key == 'Other' || key == 'other') {
                        theKeys.push(current_obj[key]);
                    } else if (TorForOther == 1) {
                        key = key.replace(/_/g, " ");
                        theKeys.push(key);
                    } else { /* false, so don't add... */ }

                }
            }

            event[json_columns[col_index]] = theKeys;
            theKeys = [];

        } else {
            //console.log("error, ", json_columns[i], " doesn't exist in event");
        }


    } //done looping through certain column


    return event;
}

module.exports.getUnapprovedevents = {
    handler: function(request, reply) {

            if (!request.params.id) {
                connection.query(`SELECT * from events where approved = 0`, function(err, rows, fields) {
                    if (err) { return reply(Boom.badRequest(`Error getting all from events`)); }

                    var events = rowsToJS(rows);
                    /*
                    var resCategories = [];
                    var resTopics = [];
                    var resAcc = [];
                    var resLanguages = [];
                    var resTags = [];
                    var resEnsembles = [];
                    var resEth = [];
                    var resDenominations = [];
                    var resInstruments = [];
                    */
                    var numUnApprovedRes = events.length;
                    var toReturn = [];

                    for (var i in events) {
                        toReturn.push(formatJSON(events[i]));
                    }

                    if (toReturn.length <= 0) {
                        return reply(Boom.badRequest("nothing to return"));
                    } else {
                        return reply(toReturn);
                    }
                });

            } else { //there is an id in the parameters
                connection.query(`SELECT * from events where approved = 0 AND id = ?`, [request.params.id], function(err, rows, fields) {
                    if (err) { return reply(Boom.badRequest(`Error getting all from events`)); }
                    //console.log(rows[0]);
                    if (rows[0] == undefined) { return reply(Boom.badRequest("nothing to return")); }
                    var event = rowsToJS(rows[0]);

                    var fixedRes = formatJSON(event);

                    if (event.length <= 0) {
                        return reply(Boom.badRequest(`events is not approved`));
                    } else {
                        //
                        var theUrl = "/event/" + String(event.id);

                        var finalObj = {
                            url: theUrl,
                            data: fixedRes
                        };

                        return reply(finalObj);
                    }


                });
            }

        } //end handler
};

module.exports.getApprovedevents = {
    handler: function(request, reply) {

            if (!request.params.id) {
                connection.query(`SELECT * from events where approved = 1`, function(err, rows, fields) {
                    if (err) { return reply(Boom.badRequest(`Error getting all from events`)); }

                    var events = rowsToJS(rows);
                    /*
                    var resCategories = [];
                    var resTopics = [];
                    var resAcc = [];
                    var resLanguages = [];
                    var resTags = [];
                    var resEnsembles = [];
                    var resEth = [];
                    var resDenominations = [];
                    var resInstruments = [];
                    */
                    var numUnApprovedRes = events.length;
                    var toReturn = [];

                    for (var i in events) {
                        toReturn.push(formatJSON(events[i]));
                    }

                    if (events.length <= 0) {
                        return reply(Boom.badRequest("nothing to return"));
                    } else {
                        return reply(toReturn);
                    }
                });

            } else { //there is an id in the parameters
                connection.query(`SELECT * from events where approved = 1 AND id = ?`, [request.params.id], function(err, rows, fields) {
                    if (err) { return reply(Boom.badRequest(`Error getting approved event`)); }
                    //console.log(rows[0]);
                    if (rows[0] == undefined) { return reply(Boom.badRequest("nothing to return")); }
                    var event = rowsToJS(rows[0]);

                    var fixedRes = formatJSON(event);

                    if (event.length <= 0) {
                        return reply(Boom.badRequest(`events is not approved`));
                    } else {
                        //
                        var theUrl = "/event/" + String(event.id);

                        var finalObj = {
                            url: theUrl,
                            data: fixedRes
                        };

                        return reply(finalObj);
                    }


                });
            }

        } //end handler

};

module.exports.getApprovedByType = {
    handler: function(request, reply) {

            if (!request.params.id) {
                connection.query(`SELECT * from events where approved = 1 AND type = ?`, [request.params.type], function(err, rows, fields) {
                    if (err) { return reply(Boom.badRequest(`Error getting all from events`)); }

                    var events = rowsToJS(rows);
                    /*
                    var resCategories = [];
                    var resTopics = [];
                    var resAcc = [];
                    var resLanguages = [];
                    var resTags = [];
                    var resEnsembles = [];
                    var resEth = [];
                    var resDenominations = [];
                    var resInstruments = [];
                    */
                    var numUnApprovedRes = events.length;
                    var toReturn = [];

                    for (var i in events) {
                        toReturn.push(formatJSON(events[i]));
                    }

                    if (events.length <= 0) {
                        return reply(Boom.badRequest("nothing to return"));
                    } else {
                        return reply(toReturn);
                    }
                });

            } else { //there is an id in the parameters
                connection.query(`SELECT * from events where approved = 0 AND id = ? AND type = ?`, [request.params.id, request.params.type], function(err, rows, fields) {
                    if (err) { return reply(Boom.badRequest(`Error getting all from events`)); }
                    //console.log(rows[0]);
                    if (rows[0] == undefined) { return reply(Boom.badRequest("nothing to return")); }
                    var event = rowsToJS(rows[0]);

                    var fixedRes = formatJSON(event);


                    if (event.length <= 0) {
                        return reply(Boom.badRequest(`events is not approved`));
                    } else {
                        //
                        var theUrl = "/event/" + String(event.id);

                        var finalObj = {
                            url: theUrl,
                            data: fixedRes
                        };

                        return reply(finalObj);
                    }


                });
            }

        } //end handler

};