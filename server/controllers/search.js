"use strict";

var Hapi = require('hapi');
var Bcrypt = require('bcryptjs');
var Boom = require('boom');
var Joi = require('joi');
var mysql = require('mysql');
var async = require('async');
const fs = require('fs');
var BasicAuth = require('hapi-auth-basic');
var options = require('../config/config.js');


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

function rowsToJS(theArray) {
    var temp = JSON.stringify(theArray);
    temp = JSON.parse(temp);
    //console.log(temp);
    return temp;
}

module.exports.searchResources = {
    handler: function(request, reply) {
            getQueryAndReturnResults("resources", request, (err, results) => {
                if (err == true) { return reply(Boom.badRequest("error getting query and returning results from Resources")); }
                return reply(results);
            });
        } //end handler
};

module.exports.searchEvents = {
    handler: function(request, reply) {
            getQueryAndReturnResults("events", request, (err, results) => {
                if (err == true) { return reply(Boom.badRequest("error getting query and returning results from Events")); }
                return reply(results);
            });
        } //end handler
};

module.exports.searchCongregations = {
    handler: function(request, reply) {
            getQueryAndReturnResults("congregations", request, (err, results) => {
                if (err == true) { return reply(Boom.badRequest("error getting query and returning results from Congregations")); }
                return reply(results);
            });
        } //end handler
};

module.exports.searchOrganizations = {
    handler: function(request, reply) {
            getQueryAndReturnResults("organizations", request, (err, results) => {
                if (err == true) { return reply(Boom.badRequest("error getting query and returning results from Organizations")); }
                return reply(results);
            });
        } //end handler
};

module.exports.searchPersons = {
    handler: function(request, reply) {
            getQueryAndReturnResults("persons", request, (err, results) => {
                if (err == true) { return reply(Boom.badRequest("error getting query and returning results from Persons")); }
                return reply(results);
            });
        } //end handler
};

module.exports.searchAll = {
    handler: function(request, reply) {
            getQueryAndReturnResultsAll(request, (err, results) => {
                if (err == true) { return reply(Boom.badRequest(err)); }
                return reply(results);
            });
        } //end handler
}

function getQueryAndReturnResults(whichTable, request, callback) {

    //receiving in body:
    /*

    {
    	"query": "<query_text_here>"
    }

    */

    var columnsToCheck = ["name", "author", "type", "website", "parent", "description", "city", "state", "country", "ethnicities", "tags", "ensembles", "accompaniment", "categories"]

    var resource_matches = {}; //object that will hold (resource_id: # matches) key-value pairs

    if (typeof whichTable == "object" || typeof whichTable == "array") {

    }

    var query = connection.query(`SELECT * FROM ${whichTable} WHERE approved = 1`, (err, rows, fields) => {
        if (err) { return callback(true, null); }
        if (rows.length <= 0) { return callback(true, null); }
        var resources = rowsToJS(rows);
        //1. Stem query
        var toStem = request.payload.query;
        //a. Add individual words to an array
        var QueryArray = toStem.match(/("[^"]+"|[^"\s]+)/g); //adds space-seperated words into an array

        //Also remove stopwords!
        for (var q_index in QueryArray) {
            if (QueryArray[q_index].match(/\bto+$/gi)) { QueryArray.splice([q_index], 1); } //remove stop word from array
            else if (QueryArray[q_index].match(/\bthe+$/gi)) { QueryArray.splice([q_index], 1); } //remove stop word from array
            else if (QueryArray[q_index].match(/\ba+$/gi)) { QueryArray.splice([q_index], 1); } //remove stop word from array
            else if (QueryArray[q_index].match(/\ban+$/gi)) { QueryArray.splice([q_index], 1); } //remove stop word from array
            else if (QueryArray[q_index].match(/\bare+$/gi)) { QueryArray.splice([q_index], 1); } //remove stop word from array
            else if (QueryArray[q_index].match(/\bis+$/gi)) { QueryArray.splice([q_index], 1); } //remove stop word from array
            else if (QueryArray[q_index].match(/\bwhat+$/gi)) { QueryArray.splice([q_index], 1); } //remove stop word from array
            else if (QueryArray[q_index].match(/\bwhere+$/gi)) { QueryArray.splice([q_index], 1); } //remove stop word from array
            else if (QueryArray[q_index].match(/\bwhen+$/gi)) { QueryArray.splice([q_index], 1); } //remove stop word from array
            else if (QueryArray[q_index].match(/\bwhy+$/gi)) { QueryArray.splice([q_index], 1); } //remove stop word from array
            else if (QueryArray[q_index].match(/\bwho+$/gi)) { QueryArray.splice([q_index], 1); } //remove stop word from array
            else if (QueryArray[q_index].match(/\bhow+$/gi)) { QueryArray.splice([q_index], 1); } //remove stop word from array

        }

        //b. Remove -ing, -ed, -er, -d, -er, -es, -ies, 
        for (var i in QueryArray) {

            var temp = QueryArray[i];

            if (temp.match(/ing+$/gi))
                temp = temp.replace(/ing+$/gi, "");
            else if (temp.match(/er+$/gi))
                temp = temp.replace(/er+$/, "");
            else if (temp.match(/es+$/gi))
                temp = temp.replace(/es+$/, "");
            else if (temp.match(/s+$/gi)) {
                if (!temp.match(/[aeiou]s+$/gi)) {
                    temp = temp.replace(/s+$/, "");
                }
            } else if (temp.match(/ed+$/gi))
                temp = temp.replace(/ed+$/, "");
            else if (temp.match(/lly+$/gi))
                temp = temp.replace(/lly+$/, "");
            else if (temp.match(/ly+$/gi))
                temp = temp.replace(/ly+$/, "");

            QueryArray[i] = temp;

        }

        //b. Now all words are stemmed, commence matching resource attributes

        //loop thru every resource
        for (var res_i in resources) {
            //loop thru every search_query
            for (var query_i in QueryArray) {
                //check every relevant column

                var regex = new RegExp(QueryArray[query_i], "gi");

                for (var col_i in columnsToCheck) {
                    var whichColumn = columnsToCheck[col_i];
                    try {
                        if (resources[res_i][whichColumn]) {
                            if (resources[res_i][whichColumn].match(regex))
                                resource_matches = addToResIDObject(resources[res_i].id, resource_matches);
                        }
                    } catch (e) {
                        console.log("error");
                        //doesn't exist, move along
                    }
                }

            }

        }

        //console.log("resource matches: ", resource_matches);


        //2. Get name, author, type, website, description, parent (no JSON cols for now) from ALL APPROVED resources

        //3. 

        return callback(null, resource_matches);


    });
}

function addToResIDObject(id, resource_matches) {
    if (id in resource_matches) {
        //it exists!
        resource_matches[id] = resource_matches[id] + 1;
    } else {
        //doesn't exist yet, so create..
        resource_matches[id] = 1;
    }

    return resource_matches;

}