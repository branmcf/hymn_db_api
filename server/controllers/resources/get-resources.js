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


function formatJSON(resource) {
    var json_columns = ["topics", "ensembles", "accompaniment", "languages", "categories", "ethnicities", "instruments", "tags", "clothing", "shape"];
    for (var i in json_columns) {
        if (resource[json_columns[i]]) {
            resource[json_columns[i]] = JSON.parse(resource[json_columns[i]]);
        } else {
            //console.log("error, ", json_columns[i], " doesn't exist in resource");
        }


    }

    return resource;
}

module.exports.getUnapprovedResources = {
    handler: function(request, reply) {

            if (!request.params.id) {
                connection.query(`SELECT * from resources where approved = 0`, function(err, rows, fields) {
                    if (err) { return reply(Boom.badRequest(`Error getting all from resources`)); }

                    var resources = rowsToJS(rows);
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
                    var numUnApprovedRes = resources.length;
                    var toReturn = [];

                    for (var i in resources) {
                        toReturn.push(formatJSON(resources[i]));
                    }

                    if (toReturn.length <= 0) {
                        return reply(Boom.badRequest("nothing to return"));
                    } else {
                        return reply(toReturn);
                    }
                });

            } else { //there is an id in the parameters
                connection.query(`SELECT * from resources where approved = 0 AND id = ?`, [request.params.id], function(err, rows, fields) {
                    if (err) { return reply(Boom.badRequest(`Error getting all from resources`)); }
                    //console.log(rows[0]);
                    if (rows[0] == undefined) { return reply(Boom.badRequest("nothing to return")); }
                    var resource = rowsToJS(rows[0]);

                    resource["url"] = resource.website;
                    resource["title"] = resource.name;
                    delete resource["website"];
                    delete resource["name"];

                    var json_columns = ["topics", "ensembles", "accompaniment", "languages", "categories", "ethnicities"];
                    for (var i in json_columns) {
                        if (resource[json_columns[i]]) {
                            resource[json_columns[i]] = JSON.parse(resource[json_columns[i]]);
                        } else {
                            console.log("error, ", i, " doesn't exist in resource");
                        }


                    }

                    if (resource.length <= 0) {
                        return reply(Boom.badRequest(`resources is not approved`));
                    } else {
                        //
                        var theUrl = "/resource/" + String(resource.id);

                        var finalObj = {
                            url: theUrl,
                            data: resource
                        };

                        return reply(finalObj);
                    }


                });
            }

        } //end handler
};

module.exports.getApprovedResources = {
    handler: function(request, reply) {

            if (!request.params.id) {
                connection.query(`SELECT * from resources where approved = 1`, function(err, rows, fields) {
                    if (err) { return reply(Boom.badRequest(`Error getting all from resources`)); }

                    var resources = rowsToJS(rows);
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
                    var numUnApprovedRes = resources.length;
                    var toReturn = [];

                    for (var i in resources) {
                        toReturn.push(formatJSON(resources[i]));
                    }

                    if (resources.length <= 0) {
                        return reply(Boom.badRequest("nothing to return"));
                    } else {
                        return reply(toReturn);
                    }
                });

            } else { //there is an id in the parameters
                connection.query(`SELECT * from resources where approved = 1 AND id = ?`, [request.params.id], function(err, rows, fields) {
                    if (err) { return reply(Boom.badRequest(`Error getting approved resource`)); }
                    //console.log(rows[0]);
                    if (rows[0] == undefined) { return reply(Boom.badRequest("nothing to return")); }
                    var resource = rowsToJS(rows[0]);

                    resource["url"] = resource.website;
                    resource["title"] = resource.name;
                    delete resource["website"];
                    delete resource["name"];

                    var json_columns = ["topics", "ensembles", "accompaniment", "languages", "categories", "ethnicities"];
                    for (var i in json_columns) {
                        if (resource[json_columns[i]]) {
                            resource[json_columns[i]] = JSON.parse(resource[json_columns[i]]);
                        } else {
                            console.log("error, ", i, " doesn't exist in resource");
                        }


                    }

                    if (resource.length <= 0) {
                        return reply(Boom.badRequest(`resources is not approved`));
                    } else {
                        //
                        var theUrl = "/resource/" + String(resource.id);

                        var finalObj = {
                            url: theUrl,
                            data: resource
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
                connection.query(`SELECT * from resources where approved = 1 AND type = ?`, [request.params.type], function(err, rows, fields) {
                    if (err) { return reply(Boom.badRequest(`Error getting all from resources`)); }

                    var resources = rowsToJS(rows);
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
                    var numUnApprovedRes = resources.length;
                    var toReturn = [];

                    for (var i in resources) {
                        toReturn.push(formatJSON(resources[i]));
                    }

                    if (resources.length <= 0) {
                        return reply(Boom.badRequest("nothing to return"));
                    } else {
                        return reply(toReturn);
                    }
                });

            } else { //there is an id in the parameters
                connection.query(`SELECT * from resources where approved = 0 AND id = ? AND type = ?`, [request.params.id, request.params.type], function(err, rows, fields) {
                    if (err) { return reply(Boom.badRequest(`Error getting all from resources`)); }
                    //console.log(rows[0]);
                    if (rows[0] == undefined) { return reply(Boom.badRequest("nothing to return")); }
                    var resource = rowsToJS(rows[0]);

                    resource["url"] = resource.website;
                    resource["title"] = resource.name;
                    delete resource["website"];
                    delete resource["name"];

                    var json_columns = ["topics", "ensembles", "accompaniment", "languages", "categories", "ethnicities"];
                    for (var i in json_columns) {
                        if (resource[json_columns[i]]) {
                            resource[json_columns[i]] = JSON.parse(resource[json_columns[i]]);
                        } else {
                            console.log("error, ", i, " doesn't exist in resource");
                        }


                    }

                    if (resource.length <= 0) {
                        return reply(Boom.badRequest(`resources is not approved`));
                    } else {
                        //
                        var theUrl = "/resource/" + String(resource.id);

                        var finalObj = {
                            url: theUrl,
                            data: resource
                        };

                        return reply(finalObj);
                    }


                });
            }

        } //end handler

};