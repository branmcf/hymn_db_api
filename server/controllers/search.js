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
            getQueryAndReturnResults("resources", null, request, (err, results) => {
                if (err) { return reply(Boom.badRequest(err)); } else { return reply(results); }
            });
        } //end handler
};

module.exports.searchEvents = {
    handler: function(request, reply) {
            getQueryAndReturnResults("events", request, null, (err, results) => {
                if (err) { return reply(Boom.badRequest(err)); } else { return reply(results); }
            });
        } //end handler
};

module.exports.searchCongregations = {
    handler: function(request, reply) {
            getQueryAndReturnResults("congregations", null, request, (err, results) => {
                if (err) { return reply(Boom.badRequest(err)); } else { return reply(results); }
            });
        } //end handler
};

module.exports.searchOrganizations = {
    handler: function(request, reply) {
            getQueryAndReturnResults("organizations", null, request, (err, results) => {
                if (err) { return reply(Boom.badRequest(err)); } else { return reply(results); }
            });
        } //end handler
};

module.exports.searchPersons = {
    handler: function(request, reply) {
            getQueryAndReturnResults("persons", null, request, (err, results) => {
                if (err) { return reply(Boom.badRequest(err)); } else { return reply(results); }
            });
        } //end handler
};

module.exports.searchArticles = {
    handler: function(request, reply) {
            getQueryAndReturnResults("resources", "articles", request, (err, results) => {
                if (err) { return reply(Boom.badRequest("error getting query and returning results from Articles")); } else { return reply(results); }
            });
        } //end handler
};

module.exports.searchBooks = {
    handler: function(request, reply) {
            getQueryAndReturnResults("resources", "book", request, (err, results) => {
                if (err) { return reply(Boom.badRequest("error getting query and returning results from Books")); } else { return reply(results); }
            });
        } //end handler
};

module.exports.searchHymns = {
    handler: function(request, reply) {
            getQueryAndReturnResults("resources", "hymn", request, (err, results) => {
                if (err) { return reply(Boom.badRequest("error getting query and returning results from Hymns")); } else { return reply(results); }
            });
        } //end handler
};

module.exports.searchThesis = {
    handler: function(request, reply) {
            getQueryAndReturnResults("resources", "thesis", request, (err, results) => {
                if (err) { return reply(Boom.badRequest("error getting query and returning results from Thesis")); } else { return reply(results); }
            });
        } //end handler
};

module.exports.searchBlogs = {
    handler: function(request, reply) {
            getQueryAndReturnResults("resources", "blog", request, (err, results) => {
                if (err) { return reply(Boom.badRequest("error getting query and returning results from Blogs")); } else { return reply(results); }
            });
        } //end handler
};

module.exports.searchForums = {
    handler: function(request, reply) {
            getQueryAndReturnResults("resources", "forum", request, (err, results) => {
                if (err) { return reply(Boom.badRequest("error getting query and returning results from Forums")); } else { return reply(results); }
            });
        } //end handler
};

module.exports.searchNews = {
    handler: function(request, reply) {
            getQueryAndReturnResults("resources", "news", request, (err, results) => {
                if (err) { return reply(Boom.badRequest("error getting query and returning results from News")); } else { return reply(results); }
            });
        } //end handler
};

module.exports.searchAudio = {
    handler: function(request, reply) {
            getQueryAndReturnResults("resources", "audio", request, (err, results) => {
                if (err) { return reply(Boom.badRequest("error getting query and returning results from Audio")); } else { return reply(results); }
            });
        } //end handler
};

module.exports.searchPodcast = {
    handler: function(request, reply) {
            getQueryAndReturnResults("resources", "podcast", request, (err, results) => {
                if (err) { return reply(Boom.badRequest("error getting query and returning results from Podcasts")); } else { return reply(results); }
            });
        } //end handler
};

module.exports.searchVideo = {
    handler: function(request, reply) {
            getQueryAndReturnResults("resources", "video", request, (err, results) => {
                if (err) { return reply(Boom.badRequest("error getting query and returning results from Videos")); } else { return reply(results); }
            });
        } //end handler
};

module.exports.searchAll = {
    handler: function(request, reply) {

            // VERY UGLY, INEFFICIENT, AND A DISGRACE... FIX LATER

            getQueryAndReturnResults("resources", null, request, (err, resourceResults) => {
                if (err == true) { return reply(Boom.badRequest(err)); }
                getQueryAndReturnResults("events", null, request, (err, eventResults) => {
                    if (err == true) { return reply(Boom.badRequest(err)); }
                    getQueryAndReturnResults("congregations", null, request, (err, congregationResults) => {
                        if (err == true) { return reply(Boom.badRequest(err)); }
                        getQueryAndReturnResults("organizations", null, request, (err, organizationResults) => {
                            if (err == true) { return reply(Boom.badRequest(err)); }
                            getQueryAndReturnResults("persons", null, request, (err, personResults) => {
                                if (err == true) { return reply(Boom.badRequest(err)); }

                                let toReturn = {
                                    resources: resourceResults,
                                    events: eventResults,
                                    congregations: congregationResults,
                                    organizations: organizationResults,
                                    persons: personResults
                                }

                                return reply(toReturn);
                            });
                        });
                    });
                });
            });
        } //end handler
}

function getQueryAndReturnResults(whichTable, additionalArgs, request, callback) {

    //receiving in body:
    /*

    {
			"query": "<query_text_here>"
    }

		*/

    var argsObj = {
        approved: 1
    };

    switch (additionalArgs) {
        case "articles":
            argsObj["type"] = "articles";
            break;
        case "book":
            argsObj["type"] = "book";
            break;
        case "hymn":
            argsObj["type"] = "hymn";
            break;
        case "thesis":
            argsObj["type"] = "thesis";
            break;
        case "blog":
            argsObj["type"] = "blog";
            break;
        case "forum":
            argsObj["type"] = "forum";
            break;
        case "news":
            argsObj["type"] = "news";
            break;
        case "audio":
            argsObj["type"] = "audio";
            break;
        case "podcast":
            argsObj["type"] = "podcast";
            break;
        case "video":
            argsObj["type"] = "video";
            break;
        default:
            break;
    }

    console.log("here?");

    var columnsToCheck = ["name", "author", "type", "website", "parent", "description", "city", "state", "country", "ethnicities", "tags", "ensembles", "accompaniment", "categories"]

    var resource_matches = {}; //object that will hold (resource_id: # matches) key-value pairs

    if (typeof whichTable == "object" || typeof whichTable == "array") {

    }

    var key_1 = 0;
    var val_1 = 0;
    var key_2 = 0;
    var val_2 = 0;

    for (var k in argsObj) {
        if (argsObj.hasOwnProperty(k)) {
            if (key_1 == 0) {
                key_1 = k;
                val_1 = argsObj[k];
            } else {
                key_2 = k;
                val_2 = argsObj[k];
            }
        }
        //doing this (below) incase the endpoint '/resource/search' is called (without a type endpoint)
        if (Object.keys(argsObj).length == 1) {
            key_2 = "approved";
            val_2 = 1;
        }
    }

    var query = connection.query(`SELECT * FROM ${whichTable} WHERE ? AND ?`, [{
        [key_1]: val_1
    }, {
        [key_2]: val_2
    }], (err, rows, fields) => {

        if (err) { return callback(true, null); }
        if (rows.length <= 0) { return callback(true, null); }
        var resources = rowsToJS(rows);
        //1. Stem query
        try {
            var toStem = request.payload.query;
            //a. Add individual words to an array
            var QueryArray = toStem.match(/("[^"]+"|[^"\s]+)/g); //adds space-seperated words into an array
        } catch (err) {
            console.log("error: ", err);
            return callback(err, null);
        }

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

        var arrayOfIDs = [];
        for (var id_key in resource_matches) {
            if (resource_matches.hasOwnProperty(id_key)) {
                arrayOfIDs.push(id_key);
            }
        }

        console.log("resource_matches: ", resource_matches);
        console.log("ids: ", arrayOfIDs);

        //2. Get name, author, type, website, description, parent (no JSON cols for now) from ALL APPROVED resources
        var query = connection.query(`SELECT * FROM ${whichTable} WHERE id in (?)`, [arrayOfIDs], (err, rows, fields) => {
            if (err) { console.log("HEEEELP"); return callback(true, null); }
            if (rows.length <= 0) { return callback(true, null); }
            var relevant_resources = rowsToJS(rows);

            return callback(null, relevant_resources);
        });

        //3. 

        //return callback(null, resource_matches);


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