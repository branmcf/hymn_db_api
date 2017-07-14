//getting all: don't return everything in "data",
//getting individual: return everything in "data"
//for quizes too?

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

function rowsToJS(theArray) {
    var temp = JSON.stringify(theArray);
    temp = JSON.parse(temp);
    //console.log(temp);
    return temp;
}


function formatJSON(congregation) {
    var json_columns = ["topics", "ensembles", "accompaniment", "languages", "categories", "ethnicities", "instruments", "clothing", "shape"];
    for (var i in json_columns) {
        if (congregation[json_columns[i]]) { //if it exists...
            congregation[json_columns[i]] = JSON.parse(congregation[json_columns[i]]);


        } else {
            //console.log("error, ", json_columns[i], " doesn't exist in congregation");
        }
    }

    //now do tags seperately and REMOVE DUPLICATES
    var tagsWithoutDuplicates = require('../../controllers/shared/remove-duplicate-tags')(JSON.parse(congregation["tags"]));
    congregation["tags"] = tagsWithoutDuplicates;

    //return the JSON columns in an array
    var theKeys = [];

    //loop through every column, check if it's true
    for (var col_index in json_columns) {
        if (congregation[json_columns[col_index]]) { //if it exists...
            var current_obj = congregation[json_columns[col_index]];
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

            congregation[json_columns[col_index]] = theKeys;
            theKeys = [];

        } else {
            //console.log("error, ", json_columns[i], " doesn't exist in congregation");
        }


    } //done looping through certain column


    return congregation;
}

module.exports.getUnapprovedcongregations = {
    handler: function(request, reply) {

            if (!request.params.id) {
                connection.query(`SELECT * from congregations where approved = 0`, function(err, rows, fields) {
                    if (err) { return reply(Boom.badRequest(`Error getting all from congregations`)); }

                    var congregations = rowsToJS(rows);


                    var numUnApprovedRes = congregations.length;
                    var toReturn = [];

                    for (var i in congregations) {
                        var toPush = formatJSON(congregations[i]);
                        toPush["url"] = toPush["website"];
                        delete toPush["website"];

                        toPush.hymn_soc_member = reformatTinyInt(toPush.hymn_soc_member);
                        //toPush.is_active = reformatTinyInt(toPush.is_active);
                        toPush.is_free = reformatTinyInt(toPush.is_free);
                        //toPush.high_level = reformatTinyInt(toPush.high_level);
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
                connection.query(`SELECT * from congregations where approved = 0 AND id = ?`, [request.params.id], function(err, rows, fields) {
                    if (err) { return reply(Boom.badRequest(`Error getting all from congregations`)); }
                    //console.log(rows[0]);
                    if (rows[0] == undefined) { return reply(Boom.badRequest("nothing to return")); }
                    var congregation = rowsToJS(rows[0]);

                    var fixedRes = formatJSON(congregation);
                    fixedRes["url"] = fixedRes["website"];
                    delete fixedRes["website"];

                    fixedRes.hymn_soc_member = reformatTinyInt(fixedRes.hymn_soc_member);
                    //fixedRes.is_active = reformatTinyInt(fixedRes.is_active);
                    fixedRes.is_free = reformatTinyInt(fixedRes.is_free);
                    //fixedRes.high_level = reformatTinyInt(fixedRes.high_level);
                    //fixedRes.approved = reformatTinyInt(fixedRes.approved);

                    if (congregation.length <= 0) {
                        return reply(Boom.badRequest(`congregations is not approved`));
                    } else {
                        //
                        var theUrl = "/congregation/" + String(congregation.id);

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

module.exports.getApprovedcongregations = {
    handler: function(request, reply) {

            if (!request.params.id) {
                connection.query(`SELECT * from congregations where approved = 1`, function(err, rows, fields) {
                    if (err) { return reply(Boom.badRequest(`Error getting all from congregations`)); }

                    var congregations = rowsToJS(rows);

                    var numUnApprovedRes = congregations.length;
                    var toReturn = [];

                    for (var i in congregations) {
                        var toPush = formatJSON(congregations[i]);
                        toPush["url"] = toPush["website"];
                        delete toPush["website"];

                        toPush.hymn_soc_member = reformatTinyInt(toPush.hymn_soc_member);
                        //toPush.is_active = reformatTinyInt(toPush.is_active);
                        toPush.is_free = reformatTinyInt(toPush.is_free);
                        //toPush.high_level = reformatTinyInt(toPush.high_level);
                        //toPush.approved = reformatTinyInt(toPush.approved);

                        toReturn.push(toPush);
                    }

                    if (congregations.length <= 0) {
                        return reply(Boom.badRequest("nothing to return"));
                    } else {
                        return reply(toReturn);
                    }
                });

            } else { //there is an id in the parameters
                connection.query(`SELECT * from congregations where approved = 1 AND id = ?`, [request.params.id], function(err, rows, fields) {
                    if (err) { return reply(Boom.badRequest(`Error getting approved congregation`)); }
                    //console.log(rows[0]);
                    if (rows[0] == undefined) { return reply(Boom.badRequest("nothing to return")); }
                    var congregation = rowsToJS(rows[0]);

                    var fixedRes = formatJSON(congregation);
                    fixedRes["url"] = fixedRes["website"];
                    delete fixedRes["website"];

                    fixedRes.hymn_soc_member = reformatTinyInt(fixedRes.hymn_soc_member);
                    //fixedRes.is_active = reformatTinyInt(fixedRes.is_active);
                    fixedRes.is_free = reformatTinyInt(fixedRes.is_free);
                    //fixedRes.high_level = reformatTinyInt(fixedRes.high_level);
                    //fixedRes.approved = reformatTinyInt(fixedRes.approved);

                    if (congregation.length <= 0) {
                        return reply(Boom.badRequest(`congregations is not approved`));
                    } else {
                        //
                        var theUrl = "/congregation/" + String(congregation.id);

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