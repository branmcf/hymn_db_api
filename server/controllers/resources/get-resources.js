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

function reformatTinyInt(toFormat) {
    switch (toFormat) {
        case (1):
            return ("true");
            break;
        case (0):
            return ("false");
            break;
        case (2):
            return ("partially");
            break;
    }
}

function reformatPractSchol(toFormat) {
    if (toFormat == 1) {
        return ("Practical");
    } else if (toFormat == 0) {
        return ("Scholarly");
    } else if (toFormat == 2) {
        return ("Both");
    } else {
        return (toFormat);
    }
}

function reformatFree(toFormat) {
    if (toFormat == 1) {
        return ("Yes");
    } else if (toFormat == 0) {
        return ("No");
    } else if (toFormat == 2) {
        return ("We do not offer this");
    } else {
        return (toFormat);
    }
}

function rowsToJS(theArray) {
    var temp = JSON.stringify(theArray);
    temp = JSON.parse(temp);
    //console.log(temp);
    return temp;
}


function formatJSON(resource) {
    var json_columns = ["topics", "ensembles", "accompaniment", "languages", "categories", "ethnicities", "instruments", "clothing", "shape"];
    for (var i in json_columns) {
        if (resource[json_columns[i]]) { //if it exists...
            resource[json_columns[i]] = JSON.parse(resource[json_columns[i]]);

        } else {
            //console.log("error, ", json_columns[i], " doesn't exist in resource");
        }
    }
    //now do tags seperately and REMOVE DUPLICATES
    var tagsWithoutDuplicates = require('../../controllers/shared/remove-duplicate-tags')(JSON.parse(resource["tags"]));
    resource["tags"] = tagsWithoutDuplicates;

    //return the JSON columns in an array
    var theKeys = [];

    //loop through every column, check if it's true
    for (var col_index in json_columns) {
        if (resource[json_columns[col_index]]) { //if it exists...
            var current_obj = resource[json_columns[col_index]];
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

            resource[json_columns[col_index]] = theKeys;
            theKeys = [];

        } else {
            //console.log("error, ", json_columns[i], " doesn't exist in resource");
        }


    } //done looping through certain column


    return resource;
}

module.exports.getUnapprovedResources = {
    handler: function(request, reply) {

            if (!request.params.id) {
                connection.query(`SELECT * from resources where approved = 0`, function(err, rows, fields) {
                    if (err) { return reply(Boom.badRequest(`Error getting all from resources`)); }

                    var resources = rowsToJS(rows);

                    var numUnApprovedRes = resources.length;
                    var toReturn = [];

                    for (var i in resources) {
                        var toPush = formatJSON(resources[i]);
                        toPush["url"] = toPush["website"];
                        toPush["title"] = toPush["name"];
                        delete toPush["website"];
                        delete toPush["name"];

                        //toPush.is_active = reformatTinyInt(toPush.is_active);
                        //toPush.high_level = reformatTinyInt(toPush.high_level);
                        toPush.hymn_soc_member = reformatTinyInt(toPush.hymn_soc_member);
                        toPush.is_free = reformatFree(toPush.is_free);
                        toPush.pract_schol = reformatPractSchol(toPush.pract_schol);
                        //toPush.approved = reformatTinyInt(toPush.approved);

                        toReturn.push(toPush);
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

                    var fixedRes = formatJSON(resource);
                    fixedRes["url"] = fixedRes["website"];
                    fixedRes["title"] = fixedRes["name"];
                    delete fixedRes["website"];
                    delete fixedRes["name"];

                    //fixedRes.is_active = reformatTinyInt(fixedRes.is_active);
                    //fixedRes.high_level = reformatTinyInt(fixedRes.high_level);
                    fixedRes.hymn_soc_member = reformatTinyInt(fixedRes.hymn_soc_member);
                    fixedRes.is_free = reformatFree(fixedRes.is_free);
                    fixedRes.pract_schol = reformatPractSchol(fixedRes.pract_schol);
                    //fixedRes.approved = reformatTinyInt(fixedRes.approved);

                    if (resource.length <= 0) {
                        return reply(Boom.badRequest(`resources is not approved`));
                    } else {
                        //
                        var theUrl = "/resource/" + String(resource.id);

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

module.exports.getApprovedResources = {
    handler: function(request, reply) {

            if (!request.params.id) {
                connection.query(`SELECT * from resources where approved = 1`, function(err, rows, fields) {
                    if (err) { return reply(Boom.badRequest(`Error getting all from resources`)); }

                    var resources = rowsToJS(rows);

                    var numUnApprovedRes = resources.length;
                    var toReturn = [];

                    for (var i in resources) {
                        var toPush = formatJSON(resources[i]);
                        toPush["url"] = toPush["website"];
                        toPush["title"] = toPush["name"];
                        delete toPush["website"];
                        delete toPush["name"];

                        //toPush.is_active = reformatTinyInt(toPush.is_active);
                        //toPush.high_level = reformatTinyInt(toPush.high_level);
                        toPush.hymn_soc_member = reformatTinyInt(toPush.hymn_soc_member);
                        toPush.is_free = reformatFree(toPush.is_free);
                        toPush.pract_schol = reformatPractSchol(toPush.pract_schol);
                        //toPush.approved = reformatTinyInt(toPush.approved);

                        toReturn.push(toPush);
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

                    var fixedRes = formatJSON(resource);
                    fixedRes["url"] = fixedRes["website"];
                    fixedRes["title"] = fixedRes["name"];
                    delete fixedRes["website"];
                    delete fixedRes["name"];

                    //fixedRes.is_active = reformatTinyInt(fixedRes.is_active);
                    //fixedRes.high_level = reformatTinyInt(fixedRes.high_level);
                    fixedRes.hymn_soc_member = reformatTinyInt(fixedRes.hymn_soc_member);
                    fixedRes.is_free = reformatFree(fixedRes.is_free);
                    fixedRes.pract_schol = reformatPractSchol(fixedRes.pract_schol);
                    //fixedRes.approved = reformatTinyInt(fixedRes.approved);

                    if (resource.length <= 0) {
                        return reply(Boom.badRequest(`resources is not approved`));
                    } else {
                        //
                        var theUrl = "/resource/" + String(resource.id);

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
                connection.query(`SELECT * from resources where approved = 1 AND type = ?`, [request.params.type], function(err, rows, fields) {
                    if (err) { return reply(Boom.badRequest(`Error getting all from resources`)); }

                    var resources = rowsToJS(rows);

                    var numUnApprovedRes = resources.length;
                    var toReturn = [];

                    for (var i in resources) {
                        var toPush = formatJSON(resources[i]);
                        toPush["url"] = toPush["website"];
                        toPush["title"] = toPush["name"];
                        delete toPush["website"];
                        delete toPush["name"];

                        //toPush.is_active = reformatTinyInt(toPush.is_active);
                        //toPush.high_level = reformatTinyInt(toPush.high_level);
                        toPush.hymn_soc_member = reformatTinyInt(toPush.hymn_soc_member);
                        toPush.is_free = reformatFree(toPush.is_free);
                        toPush.pract_schol = reformatPractSchol(toPush.pract_schol);
                        //toPush.approved = reformatTinyInt(toPush.approved);

                        toReturn.push(toPush);
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

                    var fixedRes = formatJSON(resource);
                    fixedRes["url"] = fixedRes["website"];
                    fixedRes["title"] = fixedRes["name"];
                    delete fixedRes["website"];
                    delete fixedRes["name"];

                    //fixedRes.is_active = reformatTinyInt(fixedRes.is_active);
                    //fixedRes.high_level = reformatTinyInt(fixedRes.high_level);
                    fixedRes.hymn_soc_member = reformatTinyInt(fixedRes.hymn_soc_member);
                    fixedRes.is_free = reformatFree(fixedRes.is_free);
                    fixedRes.pract_schol = reformatPractSchol(fixedRes.pract_schol);
                    //fixedRes.approved = reformatTinyInt(fixedRes.approved);

                    if (resource.length <= 0) {
                        return reply(Boom.badRequest(`resources is not approved`));
                    } else {
                        //
                        var theUrl = "/resource/" + String(resource.id);

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