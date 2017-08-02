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

var allController = {};

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
    var json_columns = ["topics", "ensembles", "accompaniment", "languages", "categories", "ethnicities", "instruments", "clothing", "shape", "tags", "denominations"];
    for (var i in json_columns) {
        if (resource[json_columns[i]]) { //if it exists...
            //check to see if it's an array...
            if (Array.isArray(resource[json_columns[i]]) == true) {
                //now do tags seperately and REMOVE DUPLICATES
                var tagsWithoutDuplicates = require('../../controllers/shared/remove-duplicate-tags')(resource["tags"]);
                resource["tags"] = tagsWithoutDuplicates;
                //nothing...
            } else if (json_columns[i] == "tags") {
                try {
                    var tagsWithoutDuplicates = JSON.parse(resource[json_columns[i]]);
                    tagsWithoutDuplicates = require('../../controllers/shared/remove-duplicate-tags')(tagsWithoutDuplicates);
                    resource["tags"] = tagsWithoutDuplicates;
                } catch (e) {
                    console.log(e.message);
                    resource[json_columns[i]] = JSON.parse(resource[json_columns[i]]);
                    //console.log(resource[json_columns[i]]);
                }

            } else {
                resource[json_columns[i]] = JSON.parse(resource[json_columns[i]]);
            }
        } else {
            //doesn't exist...
        }
    }

    //return the JSON columns in an array
    var theKeys = [];

    //loop through every column, check if it's true
    for (var col_index in json_columns) {
        if (resource[json_columns[col_index]]) { //if it exists...
            if (Array.isArray(resource[json_columns[col_index]])) { //if it's an array, just continue with the next iteration
                continue;
            }
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

allController.getConfig = {
    //auth: 'admin_only',
    handler: function(request, reply) {
        var resourcesToReturn = [];
        var eventsToReturn = [];
        var congregationsToReturn = [];
        var organizationsToReturn = [];
        var personsToReturn = [];

        var parameters = {};

        if (request.params.type == "approved") {
            parameters = { approved: 1 }
        } else if (request.params.type == "unapproved") {
            parameters = { approved: 0 }
        } else {
            parameters = "1 == 1"; //Don't judge me, I didn't ask for this.
        }

        /* =================================== Resources =================================== */
        connection.query(`SELECT * from resources where ?`, [parameters], function(err, rows, fields) {
            if (err) { return reply(Boom.badRequest(`Error getting all from resources`)); }

            var resources = rowsToJS(rows);

            for (var i in resources) {
                var toPush = formatJSON(resources[i]);
                toPush["url"] = toPush["website"];
                toPush["title"] = toPush["name"];
                delete toPush["website"];
                delete toPush["name"];

                toPush.hymn_soc_member = reformatTinyInt(toPush.hymn_soc_member);
                toPush.is_free = reformatFree(toPush.is_free);
                toPush.pract_schol = reformatPractSchol(toPush.pract_schol);

                resourcesToReturn.push(toPush);
            }
            /* =================================== Events =================================== */
            connection.query(`SELECT * from events where ?`, [parameters], function(err, rows, fields) {
                if (err) { return reply(Boom.badRequest(`Error getting all from events`)); }

                var events = rowsToJS(rows);

                for (var i in events) {
                    var toPush = formatJSON(events[i]);
                    toPush["title"] = toPush["name"];
                    toPush["url"] = toPush["website"];
                    delete toPush["name"];
                    delete toPush["website"];

                    toPush.hymn_soc_member = reformatTinyInt(toPush.hymn_soc_member);
                    toPush.is_free = reformatFree(toPush.is_free);
                    toPush.pract_schol = reformatPractSchol(toPush.pract_schol);

                    eventsToReturn.push(toPush);
                }
                /* =================================== Congregations =================================== */
                connection.query(`SELECT * from congregations where ?`, [parameters], function(err, rows, fields) {
                    if (err) { return reply(Boom.badRequest(`Error getting all from congregations`)); }

                    var congregations = rowsToJS(rows);

                    for (var i in congregations) {
                        var toPush = formatJSON(congregations[i]);
                        toPush["url"] = toPush["website"];
                        delete toPush["website"];

                        toPush.hymn_soc_member = reformatTinyInt(toPush.hymn_soc_member);
                        toPush.is_free = reformatTinyInt(toPush.is_free);

                        congregationsToReturn.push(toPush);
                    }
                    /* =================================== Organizations =================================== */
                    connection.query(`SELECT * from organizations where ?`, [parameters], function(err, rows, fields) {
                        if (err) { return reply(Boom.badRequest(`Error getting all from organizations`)); }

                        var organizations = rowsToJS(rows);

                        for (var i in organizations) {
                            var toPush = formatJSON(organizations[i]);
                            toPush["url"] = toPush["website"];
                            toPush["geographic_area"] = toPush["geography"];
                            toPush["is_org_free"] = toPush["is_free"];
                            delete toPush["website"];
                            delete toPush["geography"];
                            delete toPush["is_free"];

                            toPush.hymn_soc_member = reformatTinyInt(toPush.hymn_soc_member);
                            toPush.is_org_free = reformatFree(toPush.is_org_free);
                            toPush.events_free = reformatFree(toPush.events_free);
                            toPush.membership_free = reformatFree(toPush.membership_free);

                            organizationsToReturn.push(toPush);
                        }
                        /* =================================== Persons =================================== */
                        connection.query(`SELECT * from persons where ?`, [parameters], function(err, rows, fields) {
                            if (err) { return reply(Boom.badRequest(`Error getting all from persons`)); }

                            var persons = rowsToJS(rows);

                            for (var i in persons) {
                                var toPush = formatJSON(persons[i]);
                                toPush["url"] = toPush["website"];
                                delete toPush["website"];

                                toPush.hymn_soc_member = reformatTinyInt(toPush.hymn_soc_member);

                                personsToReturn.push(toPush);
                            }

                            //now ready to return everything
                            try {
                                let toReturn = {
                                    resources: resourcesToReturn,
                                    events: eventsToReturn,
                                    congregations: congregationsToReturn,
                                    organizations: organizationsToReturn,
                                    persons: personsToReturn
                                }

                                return reply(toReturn);
                            } catch (e) {
                                return reply(Boom.internal(e));
                            }

                        }); //end persons
                    }); //end organizations
                }); //end congregations
            }); //end events query
        }); //end resources query

    }
}

module.exports = [
    { path: '/all/{type?}', method: 'GET', config: allController.getConfig }

];