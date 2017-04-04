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


function formatJSON(organization) {
    var json_columns = ["topics", "ensembles", "accompaniment", "languages", "categories", "ethnicities", "instruments", "tags", "clothing", "shape"];
    for (var i in json_columns) {
        if (organization[json_columns[i]]) { //if it exists...
            organization[json_columns[i]] = JSON.parse(organization[json_columns[i]]);


        } else {
            //console.log("error, ", json_columns[i], " doesn't exist in organization");
        }


    }

    //return the JSON columns in an array
    var theKeys = [];

    //loop through every column, check if it's true
    for (var col_index in json_columns) {
        if (organization[json_columns[col_index]]) { //if it exists...
            var current_obj = organization[json_columns[col_index]];
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

            organization[json_columns[col_index]] = theKeys;
            theKeys = [];

        } else {
            //console.log("error, ", json_columns[i], " doesn't exist in organization");
        }


    } //done looping through certain column


    return organization;
}

module.exports.getUnapprovedorganizations = {
    handler: function(request, reply) {

            if (!request.params.id) {
                connection.query(`SELECT * from organizations where approved = 0`, function(err, rows, fields) {
                    if (err) { return reply(Boom.badRequest(`Error getting all from organizations`)); }

                    var organizations = rowsToJS(rows);
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
                    var numUnApprovedRes = organizations.length;
                    var toReturn = [];

                    for (var i in organizations) {
                        var toPush = formatJSON(organizations[i]);
                        toPush["url"] = toPush["website"];
                        toPush["geographic_area"] = toPush["geography"];
                        toPush["is_org_free"] = toPush["is_free"];
                        delete toPush["website"];
                        delete toPush["geography"];
                        delete toPush["is_free"];

                        toPush.hymn_soc_member = reformatTinyInt(toPush.hymn_soc_member);
                        toPush.is_active = reformatTinyInt(toPush.is_active);
                        toPush.is_org_free = reformatTinyInt(toPush.is_org_free);
                        toPush.high_level = reformatTinyInt(toPush.high_level);
                        //toPush.approved = reformatTinyInt(toPush.approved);
                        toPush.events_free = reformatTinyInt(toPush.events_free);
                        toPush.membership_free = reformatTinyInt(toPush.membership_free);

                        toReturn.push(toPush);
                    }

                    if (toReturn.length <= 0) {
                        return reply(Boom.badRequest("nothing to return"));
                    } else {
                        return reply(toReturn);
                    }
                });

            } else { //there is an id in the parameters
                connection.query(`SELECT * from organizations where approved = 0 AND id = ?`, [request.params.id], function(err, rows, fields) {
                    if (err) { return reply(Boom.badRequest(`Error getting all from organizations`)); }
                    //console.log(rows[0]);
                    if (rows[0] == undefined) { return reply(Boom.badRequest("nothing to return")); }
                    var organization = rowsToJS(rows[0]);

                    var fixedRes = formatJSON(organization);
                    fixedRes["url"] = fixedRes["website"];
                    fixedRes["geographic_area"] = fixedRes["geography"];
                    fixedRes["is_org_free"] = fixedRes["is_free"];
                    delete fixedRes["website"];
                    delete fixedRes["geography"];
                    delete fixedRes["is_free"];

                    fixedRes.hymn_soc_member = reformatTinyInt(fixedRes.hymn_soc_member);
                    fixedRes.is_active = reformatTinyInt(fixedRes.is_active);
                    fixedRes.is_org_free = reformatTinyInt(fixedRes.is_org_free);
                    fixedRes.high_level = reformatTinyInt(fixedRes.high_level);
                    //fixedRes.approved = reformatTinyInt(fixedRes.approved);
                    fixedRes.events_free = reformatTinyInt(fixedRes.events_free);
                    fixedRes.membership_free = reformatTinyInt(fixedRes.membership_free);

                    if (organization.length <= 0) {
                        return reply(Boom.badRequest(`organizations is not approved`));
                    } else {
                        //
                        var theUrl = "/organization/" + String(organization.id);

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

module.exports.getApprovedorganizations = {
    handler: function(request, reply) {

            if (!request.params.id) {
                connection.query(`SELECT * from organizations where approved = 1`, function(err, rows, fields) {
                    if (err) { return reply(Boom.badRequest(`Error getting all from organizations`)); }

                    var organizations = rowsToJS(rows);
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
                    var numUnApprovedRes = organizations.length;
                    var toReturn = [];

                    for (var i in organizations) {
                        var toPush = formatJSON(organizations[i]);
                        toPush["url"] = toPush["website"];
                        toPush["geographic_area"] = toPush["geography"];
                        toPush["is_org_free"] = toPush["is_free"];
                        delete toPush["website"];
                        delete toPush["geography"];
                        delete toPush["is_free"];

                        toPush.hymn_soc_member = reformatTinyInt(toPush.hymn_soc_member);
                        toPush.is_active = reformatTinyInt(toPush.is_active);
                        toPush.is_org_free = reformatTinyInt(toPush.is_org_free);
                        toPush.high_level = reformatTinyInt(toPush.high_level);
                        //toPush.approved = reformatTinyInt(toPush.approved);
                        toPush.events_free = reformatTinyInt(toPush.events_free);
                        toPush.membership_free = reformatTinyInt(toPush.membership_free);

                        toReturn.push(toPush);
                    }

                    if (organizations.length <= 0) {
                        return reply(Boom.badRequest("nothing to return"));
                    } else {
                        return reply(toReturn);
                    }
                });

            } else { //there is an id in the parameters
                connection.query(`SELECT * from organizations where approved = 1 AND id = ?`, [request.params.id], function(err, rows, fields) {
                    if (err) { return reply(Boom.badRequest(`Error getting approved organization`)); }
                    //console.log(rows[0]);
                    if (rows[0] == undefined) { return reply(Boom.badRequest("nothing to return")); }
                    var organization = rowsToJS(rows[0]);

                    var fixedRes = formatJSON(organization);
                    fixedRes["url"] = fixedRes["website"];
                    fixedRes["geographic_area"] = fixedRes["geography"];
                    fixedRes["is_org_free"] = fixedRes["is_free"];
                    delete fixedRes["website"];
                    delete fixedRes["geography"];
                    delete fixedRes["is_free"];

                    fixedRes.hymn_soc_member = reformatTinyInt(fixedRes.hymn_soc_member);
                    fixedRes.is_active = reformatTinyInt(fixedRes.is_active);
                    fixedRes.is_org_free = reformatTinyInt(fixedRes.is_org_free);
                    fixedRes.high_level = reformatTinyInt(fixedRes.high_level);
                    //fixedRes.approved = reformatTinyInt(fixedRes.approved);
                    fixedRes.events_free = reformatTinyInt(fixedRes.events_free);
                    fixedRes.membership_free = reformatTinyInt(fixedRes.membership_free);

                    if (organization.length <= 0) {
                        return reply(Boom.badRequest(`organizations is not approved`));
                    } else {
                        //
                        var theUrl = "/organization/" + String(organization.id);

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