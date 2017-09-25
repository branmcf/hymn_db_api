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
if (process.env.JAWSDB_URL) {
    connection = mysql.createConnection(process.env.JAWSDB_URL);
}

//connection.connect();

congController = {};
var congregations = [];
var numCongs = 0;
var congCategories, congCategories_all = [];
var congInstruments, congInstruments_all = [];
var congEthnicities, congEthnicities_all = [];
var congTags, congTags_all = [];
var congShape, congShape_all = [];
var congAttire, congAttire_all = [];

function rowsToJS(theArray) {
    var temp = JSON.stringify(theArray);
    temp = JSON.parse(temp);
    //console.log(temp);
    return temp;
}

function popArray(obj, whichArray) {

    obj = JSON.parse(obj);
    if (obj == null) {
        whichArray.push([]);
        return;
    }

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



function insertCongregation(theObj) {

    var justCongregation = JSON.parse(JSON.stringify(theObj));

    justCongregation.categories = JSON.stringify(justCongregation.categories);
    justCongregation.ethnicities = JSON.stringify(justCongregation.ethnicities);
    justCongregation.tags = JSON.stringify(justCongregation.tags);
    justCongregation.instruments = JSON.stringify(justCongregation.instruments);
    justCongregation.clothing = JSON.stringify(justCongregation.clothing);
    justCongregation.shape = JSON.stringify(justCongregation.shape);

    // TYPE CONVERSION
    if (typeof justCongregation.hymn_soc_member == "string") {
        if (justCongregation.hymn_soc_member == "no" || justCongregation.hymn_soc_member == "No" || justCongregation.hymn_soc_member == "false" || justCongregation.hymn_soc_member == "False") {
            justCongregation.hymn_soc_member = 0;
        } else if (justCongregation.hymn_soc_member == "Yes" || justCongregation.hymn_soc_member == "yes" || justCongregation.hymn_soc_member == "True") {
            justCongregation.hymn_soc_member = 1;
        } else {
            justCongregation.hymn_soc_member = 0;
        }
    }

    if (typeof justCongregation.is_free == "string") {
        if (justCongregation.is_free == "yes" || justCongregation.is_free == "Yes") {
            justCongregation.is_free = 1;
        } else if (justCongregation.is_free == "no" || justCongregation.is_free == "No") {
            justCongregation.is_free = 0;
        } else {
            justCongregation.is_free = 2;
        }
    } else if (typeof justCongregation.is_free !== "number") {
        justCongregation.is_free = 2;
    }


    // END TYPE CONVERSION

    connection.query(`INSERT INTO congregations set ?`, justCongregation, function(err, rows, fields) {
        if (err) { throw err; }

        var JSObj = rowsToJS(theObj);

        congregations.push(JSObj);


    });
} //end func


/*
===================================================
- congregations -
===================================================
*/

function formatCong(actualIndex) {
    var congData = {};

    congData = {
        id: congregations[actualIndex].id,
        name: congregations[actualIndex].name,
        url: congregations[actualIndex].website,
        parent: congregations[actualIndex].parent,
        denomination: congregations[actualIndex].denomination,
        city: congregations[actualIndex].city,
        state: congregations[actualIndex].state,
        country: congregations[actualIndex].country,
        geography: congregations[actualIndex].geography,
        is_free: congregations[actualIndex].is_free,
        attendance: congregations[actualIndex].attendance,
        hymn_soc_member: congregations[actualIndex].hymn_soc_member,
        is_active: congregations[actualIndex].is_active,
        high_level: congregations[actualIndex].high_level,
        user_id: congregations[actualIndex].user_id,
        user: congregations[actualIndex].user,
        description_of_worship_to_guests: congregations[actualIndex].description_of_worship_to_guests,
        process: congregations[actualIndex].process,
        approved: congregations[actualIndex].approved,

        clothing: congAttire_all[0][actualIndex],
        shape: congShape_all[0][actualIndex],
        categories: congCategories_all[0][actualIndex],
        instruments: congInstruments_all[0][actualIndex],
        ethnicities: congEthnicities_all[0][actualIndex],
        tags: congTags_all[0][actualIndex]

    };

    congData.hymn_soc_member = reformatTinyInt(congData.hymn_soc_member);
    congData.is_active = reformatTinyInt(congData.is_active);
    congData.is_free = reformatTinyInt(congData.is_free);
    congData.high_level = reformatTinyInt(congData.high_level);
    congData.approved = reformatTinyInt(congData.approved);

    //format 
    /*
      congData.ethnicities = JSON.parse(congData.ethnicities);
      congData.tags = JSON.parse(congData.tags);
      congData.categories = JSON.parse(congData.categories);
      congData.instruments = JSON.parse(congData.instruments);
    */
    //end formatting

    var theUrl = "/congregations/" + String(actualIndex + 1);

    var finalObj = {
        url: theUrl,
        data: congData
    };

    //var str = JSON.stringify(finalObj);

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


//CONGREGATION GET REQUEST
congController.getConfig = {
    handler: function(request, reply) {
        if (request.params.id) {

            if ((numCongs <= request.params.id - 1) || (0 > request.params.id - 1)) {
                return reply(Boom.notFound("Index out of range for congregations get request"));
            }

            var actualIndex = Number(request.params.id) - 1;
            //create new object, convert to json

            if (congregations[actualIndex].approved == 0) {
                var str = formatCong(actualIndex);
                return reply(str);
            } else {
                return reply(Boom.badRequest("The Resource you request is already approved"));
            }

        }

        var objToReturn = [];

        for (var i = 0; i < congregations.length; i++) {
            //var bob = formatResource(i);

            if (congregations[i].approved == 0) {
                var str = {
                    id: congregations[i].id,
                    user: congregations[i].user,
                    title: congregations[i].name
                }
                objToReturn.push(str);
            }


        } //end for

        //console.log(objToReturn);
        if (objToReturn.length <= 0) {
            return reply(Boom.badRequest("All congregations already approved, nothing to return"));
        } else {
            reply(objToReturn);
        }
    }
}

//BELOW is for the POST request
function insertFirst(toInsert, _callback) {

    insertCongregation(toInsert);

    _callback();
}

function insertAndGet(toInsert, callback) {

    insertFirst(toInsert, function() {
        connection.query(`SELECT * from congregations`, function(err, rows, fields) {
            if (err) { callback(err, null); }

            var JSObj = rowsToJS(rows);

            callback(null, JSObj[JSObj.length - 1].id); //get the last element's id

        });

    });
}


//CONGREGATION POST REQUEST
congController.postConfig = {
        //auth: 'high_or_admin',
        handler: function(req, reply) {

                //getcongregationsJSON();

                //var theCongID = congregations.length + 1;

                if (!req.payload.data.uid) {
                    try {
                        var newCong = {
                            name: req.payload.data.name,
                            website: req.payload.data.url,
                            parent: req.payload.data.parent,
                            denomination: req.payload.data.denomination,
                            city: req.payload.data.city,
                            state: req.payload.data.state,
                            country: req.payload.data.country,
                            geography: req.payload.data.geography,
                            is_free: req.payload.data.is_org_free,
                            attendance: req.payload.data.attendance,
                            process: req.payload.data.process,
                            hymn_soc_member: req.payload.data.hymn_soc_member,
                            user: req.payload.user,
                            user_id: null,
                            clothing: req.payload.data.clothing,
                            shape: req.payload.data.shape,
                            description_of_worship_to_guests: req.payload.data.description_of_worship_to_guests,
                            is_active: true,

                            categories: req.payload.data.categories,
                            instruments: req.payload.data.instruments,
                            ethnicities: req.payload.data.ethnicities,
                            tags: req.payload.data.tags

                        };
                    } catch (e) {
                        return reply(Boom.badData("No uid supplied and error in another variable"));
                    }

                } else {

                    var newCong = {
                        name: req.payload.data.name,
                        website: req.payload.data.url,
                        parent: req.payload.data.parent,
                        denomination: req.payload.data.denomination,
                        city: req.payload.data.city,
                        state: req.payload.data.state,
                        country: req.payload.data.country,
                        geography: req.payload.data.geography,
                        is_free: req.payload.data.is_org_free,
                        attendance: req.payload.data.attendance,
                        process: req.payload.data.process,
                        hymn_soc_member: req.payload.data.hymn_soc_member,
                        user: req.payload.user,
                        user_id: req.payload.uid,
                        clothing: req.payload.data.clothing,
                        shape: req.payload.data.shape,
                        description_of_worship_to_guests: req.payload.data.description_of_worship_to_guests,
                        is_active: true,

                        categories: req.payload.data.categories,
                        instruments: req.payload.data.instruments,
                        ethnicities: req.payload.data.ethnicities,
                        tags: req.payload.data.tags

                    };
                }

                insertAndGet(newCong, (err, theID) => {
                    var toReturn = {
                        cong_id: theID,
                        id_of_matches_found: []
                    }

                    var lookForDuplicate = require('../../controllers/shared/check-for-duplicates')("congregations", theData, (err, results) => {
                        if (err) { console.log("ERROR: ", err); }
                        //results is an array of id's of matching resources/congrgations/etc.
                        //if it is empty, then there were no matches found
                        else {
                            toReturn.id_of_matches_found = results;
                        }

                        return reply(toReturn);
                    });
                });




            } //end handler  

    } //end postConfig


//delete
congController.deleteConfig = {
    //auth: 'admin_only',
    handler: function(req, reply) {
            var query = connection.query(`DELETE FROM congregations WHERE id=${req.params.id}`, function(err, rows, fields) {
                if (err) { return reply(Boom.badRequest("error when deleting from congregations")); }
                return reply({
                    code: 202,
                    message: `Successfully deleted congregations with id=${req.params.id}`
                });
            });
        } //end handler
};

congController.updateConfig = {
    //auth: 'admin_only',
    handler: function(request, reply) {
        if (request.params.id) {
            if (numCongs <= request.params.id - 1) {
                //return reply('Not enough resources in the database for your request').code(404);
                return reply(Boom.notFound("Entered invalid id for congregations activate endpoint"));
            }
            //if (resources.length <= request.params.id - 1) return reply('Not enough resources in the database for your request').code(404);
            var actualIndex = Number(request.params.id - 1); //if you request for resources/1 you'll get resources[0]

            var mysqlIndex = Number(request.params.id);

            var theCol = request.payload.column;
            var theVal = request.payload.value;

            //replace the inner single quotes with double quotes...
            try {
                theVal = theVal.replace(/'/g, '"');
            } catch (e) {
                console.log("ERROR: ", e.message);
            }

            if (theCol == "id") { return reply(Boom.unauthorized("cannot change that...")); }

            var query = connection.query(`
            UPDATE congregations SET ?
            WHERE ?`, [{
                [theCol]: theVal
            }, { id: mysqlIndex }], function(err, rows, fields) {
                if (err) {
                    //console.log(query.sql);
                    return reply(Boom.badRequest(`invalid query when updating resources on column ${request.payload.what_var} with value = ${request.payload.what_val} `));
                } else {
                    //getcongregationsJSON();
                    //console.log(query.sql);
                    //console.log("set cong #", mysqlIndex, ` variable ${theCol} = ${theVal}`);
                }

                return reply({ statusCode: 201 });
            });

            //return reply(resources[actualId]);
        }


    }
};

//CONGREGATION GET REQUEST
congController.getApprovedConfig = {
    handler: function(request, reply) {


            connection.query('SELECT * from congregations', function(err, rows, fields) {
                if (err) { return reply(Boom.badRequest("error getting congregations in approveCongregations")); }

                congregations = [];
                congCategories = [];
                congInstruments = [];
                congEthnicities = [];
                congTags = [];
                congShape = [];
                congAttire = [];

                var JSObj = rowsToJS(rows);
                congregations = JSObj;

                numCongs = congregations.length;

                //console.log("\nT: ", rows[0]);
                for (var i = 0; i < JSObj.length; i++) {
                    popArray(JSObj[i]["ethnicities"], congEthnicities);
                    popArray(JSObj[i]["categories"], congCategories);
                    popArray(JSObj[i]["tags"], congTags);
                    popArray(JSObj[i]["instruments"], congInstruments);
                    popArray(JSObj[i]["shape"], congShape);
                    popArray(JSObj[i]["clothing"], congAttire);

                    congAttire_all.push(congAttire);
                    congEthnicities_all.push(congEthnicities);
                    congCategories_all.push(congCategories);
                    congTags_all.push(congTags);
                    congInstruments_all.push(congInstruments);
                    congShape_all.push(congShape);

                }

                if (request.params.id) {
                    if ((numCongs <= request.params.id - 1) || (0 > request.params.id - 1)) {
                        return reply(Boom.notFound("Index out of range for congregations get request"));
                    }

                    var actualIndex = Number(request.params.id) - 1;
                    //create new object, convert to json

                    if (congregations[actualIndex].approved == 1) {
                        var str = formatCong(actualIndex);
                        return reply(str);
                    } else {
                        return reply(Boom.badRequest("The Resource you request is already approved"));
                    }
                }

                var objToReturn = [];

                for (var i = 0; i < congregations.length; i++) {
                    //var bob = formatResource(i);

                    if (congregations[i].approved == 1) {
                        var str = formatCong(i);
                        objToReturn.push(str);
                    }


                } //end for

                //console.log(objToReturn);
                if (objToReturn.length <= 0) {
                    return reply(Boom.badRequest("All congregations already approved, nothing to return"));
                } else {
                    reply(objToReturn);
                }
            });
        } //end handler
};

congController.editConfig = {
    //auth: 'high_or_admin',
    handler: function(req, reply) {

            //getcongregationsJSON();

            var newCong = {
                user: req.payload.user,
                user_id: req.payload.uid,

                name: req.payload.data.name,
                website: req.payload.data.url,
                parent: req.payload.data.parent,
                denomination: req.payload.data.denomination,
                city: req.payload.data.city,
                state: req.payload.data.state,
                country: req.payload.data.country,
                geography: req.payload.data.geography,
                is_free: req.payload.data.is_free,
                attendance: req.payload.data.attendance,
                process: req.payload.data.process,
                hymn_soc_member: req.payload.data.hymn_soc_member,
                clothing: req.payload.data.clothing,
                shape: req.payload.data.shape,
                description_of_worship_to_guests: req.payload.data.description_of_worship_to_guests,
                is_active: true,
                events_free: req.payload.data.events_free,
                approved: req.payload.data.approved,

                categories: req.payload.data.categories,
                instruments: req.payload.data.instruments,
                ethnicities: req.payload.data.ethnicities,
                tags: req.payload.data.tags

            };

            var justCongregation = JSON.parse(JSON.stringify(newCong));

            justCongregation.categories = JSON.stringify(justCongregation.categories);
            justCongregation.ethnicities = JSON.stringify(justCongregation.ethnicities);
            justCongregation.tags = JSON.stringify(justCongregation.tags);
            justCongregation.instruments = JSON.stringify(justCongregation.instruments);
            justCongregation.clothing = JSON.stringify(justCongregation.clothing);
            justCongregation.shape = JSON.stringify(justCongregation.shape);

            // TYPE CONVERSION
            if (typeof justCongregation.hymn_soc_member == "string") {
                if (justCongregation.hymn_soc_member == "no" || justCongregation.hymn_soc_member == "No" || justCongregation.hymn_soc_member == "false" || justCongregation.hymn_soc_member == "False") {
                    justCongregation.hymn_soc_member = 0;
                } else if (justCongregation.hymn_soc_member == "partially" || justCongregation.hymn_soc_member == "Partially") {
                    justCongregation.hymn_soc_member = 2;
                } else {
                    justCongregation.hymn_soc_member = 1;
                }
            } else if (typeof justCongregation.hymn_soc_member !== "number") {
                justCongregation.hymn_soc_member = 2;
            }

            if (typeof justCongregation.is_free == "string") {
                if (justCongregation.is_free == "no" || justCongregation.is_free == "No" || justCongregation.is_free == "False" || justCongregation.is_free == "false") {
                    justCongregation.is_free = 0;
                } else if (justCongregation.is_free == "yes" || justCongregation.is_free == "Yes" || justCongregation.is_free == "True" || justCongregation.is_free == "true") {
                    justCongregation.is_free = 1;
                } else {
                    justCongregation.is_free = 2;
                }
            } else {
                justCongregation.is_free = 0;
            }

            if (typeof justCongregation.events_free == "string") {
                if (justCongregation.events_free == "no" || justCongregation.events_free == "No" || justCongregation.events_free == "False" || justCongregation.events_free == "false") {
                    justCongregation.events_free = 0;
                } else if (justCongregation.events_free == "yes" || justCongregation.events_free == "Yes" || justCongregation.events_free == "True" || justCongregation.events_free == "true") {
                    justCongregation.events_free = 1;
                } else {
                    justCongregation.events_free = 2;
                }
            } else {
                justCongregation.events_free = 0;
            }
            // END TYPE CONVERSION

            try {
                if (req.params.id) {
                    connection.query(`SELECT approved FROM congregations WHERE id = ?`, [req.params.id], (err, rows, fields) => {
                        if (err) { return reply(Boom.badRequest(err)); } else {
                            if (rows.length > 0) {
                                try {
                                    var isApproved = rowsToJS(rows)[0].approved;
                                    if (isApproved == 1) {
                                        justCongregation.approved = 1;
                                    } else {
                                        justCongregation.approved = 0;
                                    }
                                } catch (e) {
                                    return reply(Boom.badRequest(e));
                                }
                            }
                        }
                    });
                }

            } catch (e) {
                console.log("couldn't get approved variable...");
                console.log(e);
            }

            var query = connection.query(`
    UPDATE congregations SET ?
    WHERE ?`, [justCongregation, { id: req.params.id }], function(err, rows, fields) {
                if (err) {
                    return reply(Boom.badRequest(`invalid query when updating congregations with id = ${req.params.id} `));
                } else {
                    //console.log("edited cong #", req.params.id);
                }

                return reply({ statusCode: 201 });
            });




        } //end handler  
};

congController.addTagConfig = {
    //auth:
    handler: function(request, reply) {
        connection.query(`SELECT id FROM congregations`, (err, rows, fields) => {
            if (err) { return reply(Boom.badRequest("error selecting congregations in updateConfig")); }
            if (request.params.id) {

                //console.log("request.payload.tag: ", request.payload.tag);
                var receivedtag = request.payload.tag; //receive tag from body, parse to JSObj

                //get existing tag
                connection.query(`SELECT tags FROM congregations WHERE id = ?`, [request.params.id], (err, rows, fields) => {
                    if (err) { return reply(Boom.badRequest("error selecting tag from congregation")); }
                    //console.log("rows[0]: ", rowsToJS(rows[0].tag));
                    if (rowsToJS(rows[0].tags) !== null) {
                        var currenttag = JSON.parse(rows[0].tags);
                    } else {
                        var currenttag = [];
                    }

                    currenttag.push(receivedtag);

                    connection.query(`UPDATE congregations SET tags = ? WHERE id = ?`, [JSON.stringify(currenttag), request.params.id], (err, rows, fields) => {
                        if (err) { return reply(Boom.badRequest("error adding tag to congregation")); }
                        return reply({ statusCode: 201 });

                    });

                });



            } else {
                return reply(Boom.notFound("must supply and id as a parameter"));

            }
        });
    }

};

//var postQuizController = require('../../controllers/congregations/post-quiz-congregation').postQuiz;

var postQuizController = require('../../controllers/post-quiz-then-get').postQuizCongregations;
var getUnapprovedRes = require('../../controllers/congregations/get-congregations').getUnapprovedcongregations;
var getApprovedRes = require('../../controllers/congregations/get-congregations').getApprovedcongregations;
var addValueConfig = require('../../controllers/shared/add-values').congregations;

var searchResourceConfig = require('../../controllers/search.js').searchCongregations;

module.exports = [
    { path: '/congregation', method: 'POST', config: congController.postConfig },
    { path: '/congregation/{id?}', method: 'GET', config: getUnapprovedRes },
    { path: '/congregation/approved/{id?}', method: 'GET', config: getApprovedRes },
    { path: '/congregation/{id}', method: 'DELETE', config: congController.deleteConfig },
    { path: '/congregation/{id}', method: 'PUT', config: congController.editConfig },
    { path: '/congregation/update/{id}', method: 'PUT', config: congController.updateConfig },
    { path: '/quiz/congregation', method: 'POST', config: postQuizController },
    { path: '/congregation/addvalues/{id}', method: 'PUT', config: addValueConfig },
    { path: '/congregation/search', method: 'POST', config: searchResourceConfig }


];