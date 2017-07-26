"use strict";

var Hapi = require('hapi');
var Bcrypt = require('bcryptjs');
var Boom = require('boom');
var Joi = require('joi');
var mysql = require('mysql');
var async = require('async');
const fs = require('fs');
var BasicAuth = require('hapi-auth-basic');
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

connection.connect();

function JSONobjectToArray(json_object) {
    var arrayToReturn = [];
    for (var key in json_object) {
        // skip loop if the property is from prototype
        if (!json_object.hasOwnProperty(key)) continue;

        try {
            var theValue = json_object[key];
            if (theValue !== "false" && theValue !== false) {
                if (theValue == "true" || theValue == true) {
                    arrayToReturn.push(key);
                } else { //it's an 'Other' category...
                    arrayToReturn.push(theValue);
                }
            }
        } catch (e) {
            console.log("error in JSONobjectToArray: ", e);
        }
        //console.log(key, ": ", theValue);
    } //done with for loop

    return arrayToReturn;

    return json_object;
}

function addToTags(request, reply, tagsArray, whichColumn, whichTable) {

    var receivedValues = tagsArray; //receive tag from body, parse to JSObj

    //get existing tag
    var currentVals = [];

    connection.query(`SELECT tags FROM ${whichTable} WHERE id = ?`, [request.params.id], (err, rows, fields) => {
        if (err) { return reply(Boom.badRequest(`error selecting tag from ${whichTable}`)); }
        if (rowsToJS(rows[0].tags) !== null) {
            currentVals = JSON.parse(rows[0].tags);
        } else {
            currentVals = [];
        }

        //if an OBJECT is received:
        if (typeof receivedValues == "object" || typeof receivedValues == "Object") {
            for (var rec_tag_index in receivedValues) {
                console.log("pushing to : ", currentVals);
                currentVals.push(receivedValues[rec_tag_index]);
            }
        } else if (typeof receivedValues == "string" || typeof receivedValues == "String") {
            currentVals.push(receivedValues);
        } else {
            return reply(Boom.badRequest(`received Values are not of object or string type...`));
        }

        var query = connection.query(`
            UPDATE ${whichTable} SET ?
            WHERE ?`, [{
            [whichColumn]: JSON.stringify(currentVals)
        }, { id: request.params.id }], function(err, rows, fields) {
            if (err) { return reply(Boom.badRequest(`error adding tag to ${whichTable}`)); }
            return reply({ statusCode: 201 });

        });

    });
}

//seperate function for other json columns (apart from tags) because the other json columns must be stored like:
// {"item 1": true, "item 2": true, "Other": "item 3"}
function addToJSONColumn(request, reply, valuesArray, whichColumn, whichTable) {
    var receivedValues = valuesArray; //receive tag from body, parse to JSObj

    //get existing tag
    connection.query(`SELECT ${whichColumn} FROM ${whichTable} WHERE id = ?`, [request.params.id], (err, rows, fields) => {
        if (err) { return reply(Boom.badRequest(`error selecting tag from ${whichTable}`)); }
        if (rowsToJS(rows[0][whichColumn]) !== null) {
            var currentVals = JSON.parse(rows[0][whichColumn]);
            if (typeof currentVals == "array") {
                console.log("\n\nFOUND ARRAY\n\n");
            }
            //since you will receive a json object (after parsing it), store the true and other items into an array
            currentVals = JSONobjectToArray(currentVals);
        } else {
            var currentVals = [];
        }

        //if an OBJECT is received:
        if (typeof receivedValues == "object" || typeof receivedValues == "Object") {
            for (var rec_tag_index in receivedValues) {
                currentVals.push(receivedValues[rec_tag_index]);
            }
        } else if (typeof receivedValues == "string" || typeof receivedValues == "String") {
            currentVals.push(receivedValues);
        } else {
            return reply(Boom.badRequest(`received Values are not of object or string type...`));
        }

        //now turn the currentVals array back into a javascript object!
        var updatedJSObject = {};
        for (var array_index in currentVals) {
            let temp_key = currentVals[array_index];
            updatedJSObject[temp_key] = true;
        }
        //console.log("UPDATED OBJECT: ", updatedJSObject);

        var query = connection.query(`
            UPDATE ${whichTable} SET ?
            WHERE ?`, [{
            [whichColumn]: JSON.stringify(updatedJSObject)
        }, { id: request.params.id }], function(err, rows, fields) {
            if (err) { return reply(Boom.badRequest(`error adding tag to ${whichTable}`)); }
            return reply({ statusCode: 201 });

        });

    });
}

module.exports.resources = {
    handler: (request, reply) => {
        if (request.params.id) {
            try {
                var whichColumn = request.payload.column;
                var receivedValues = request.payload.values; //receive tag from body, parse to JSObj
            } catch (e) {
                return reply(Boom.badRequest(`error selecting tag from resources: `, e));
            }

            addToJSONColumn(request, reply, receivedValues, whichColumn, "resources");

        } else {
            return reply(Boom.notFound("must supply and id as a parameter"));

        }
    }
};

module.exports.events = {
    handler: (request, reply) => {
        if (request.params.id) {
            try {
                var whichColumn = request.payload.column;
                var receivedValues = request.payload.values; //receive tag from body, parse to JSObj
            } catch (e) {
                return reply(Boom.badRequest(`error selecting tag from events: `, e));
            }

            addToJSONColumn(request, reply, receivedValues, whichColumn, "events");

        } else {
            return reply(Boom.notFound("must supply and id as a parameter"));

        }
    }
};

module.exports.organizations = {
    handler: (request, reply) => {
        if (request.params.id) {
            try {
                var whichColumn = request.payload.column;
                var receivedValues = request.payload.values; //receive tag from body, parse to JSObj
            } catch (e) {
                return reply(Boom.badRequest(`error selecting tag from organizations: `, e));
            }

            addToJSONColumn(request, reply, receivedValues, whichColumn, "organizations");

        } else {
            return reply(Boom.notFound("must supply and id as a parameter"));

        }
    }
};

module.exports.congregations = {
    handler: (request, reply) => {
        if (request.params.id) {
            try {
                var whichColumn = request.payload.column;
                var receivedValues = request.payload.values; //receive tag from body, parse to JSObj
            } catch (e) {
                return reply(Boom.badRequest(`error selecting tag from congregations: `, e));
            }

            addToJSONColumn(request, reply, receivedValues, whichColumn, "congregations");


        } else {
            return reply(Boom.notFound("must supply and id as a parameter"));

        }
    }
};

module.exports.persons = {
    handler: (request, reply) => {
        if (request.params.id) {
            try {
                var whichColumn = request.payload.column;
                var receivedValues = request.payload.values; //receive tag from body, parse to JSObj
            } catch (e) {
                return reply(Boom.badRequest(`error selecting tag from persons: `, e));
            }

            addToJSONColumn(request, reply, receivedValues, whichColumn, "persons");


        } else {
            return reply(Boom.notFound("must supply and id as a parameter"));

        }
    }
};

function rowsToJS(theArray) {
    var temp = JSON.stringify(theArray);
    temp = JSON.parse(temp);
    //console.log(temp);
    return temp;
}