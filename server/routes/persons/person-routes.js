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

personController = {};
var persons = [];
var personNumPersons = 0;
var personTopics, personTopics_all = [];
var personEnsembles, personEnsembles_all = [];
var personEthnicities, personEthnicities_all = [];
var personInstruments, personInstruments_all = [];
var personCategories, personCategories_all = [];
var personTags, personTags_all = [];
var personLangs, personLangs_all = [];


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


function insertPerson(theObj) {

    var justPerson = JSON.parse(JSON.stringify(theObj));

    justPerson.categories = JSON.stringify(justPerson.categories);
    justPerson.topics = JSON.stringify(justPerson.topics);
    justPerson.ethnicities = JSON.stringify(justPerson.ethnicities);
    justPerson.tags = JSON.stringify(justPerson.tags);
    justPerson.ensembles = JSON.stringify(justPerson.ensembles);
    justPerson.instruments = JSON.stringify(justPerson.instruments);
    justPerson.languages = JSON.stringify(justPerson.languages);

    //console.log("\n\njustPerson: \n\n", justPerson);

    // TYPE CONVERSION
    if (typeof justPerson.hymn_soc_member == "string") {
        if (justPerson.hymn_soc_member == "yes" || justPerson.hymn_soc_member == "Yes" || justPerson.hymn_soc_member == "true" || justPerson.hymn_soc_member == "True") {
            justPerson.hymn_soc_member = 1;
        } else {
            justPerson.hymn_soc_member = 0;
        }
    }

    if (typeof justPerson.pract_schol == "string") {
        if (justPerson.pract_schol == "Practical" || justPerson.pract_schol == "practical") {
            justPerson.pract_schol = 1;
        } else if (justPerson.pract_schol == "Scholarly" || justPerson.pract_schol == "scholarly") {
            justPerson.pract_schol = 0;
        } else {
            justPerson.pract_schol = 2;
        }
    }


    // END TYPE CONVERSION

    connection.query(`INSERT INTO persons set ?`, justPerson, function(err, rows, fields) {
        if (err) { throw err; }

        var JSObj = rowsToJS(theObj);
        persons.push(JSObj);
    });
}

/*
===================================================
- PERSON Controllers -
===================================================
*/



function formatPerson(actualIndex) {
    var personData = {};

    personData = {
        id: persons[actualIndex].id,
        first_name: persons[actualIndex].first_name,
        last_name: persons[actualIndex].last_name,
        email: persons[actualIndex].email,
        city: persons[actualIndex].city,
        state: persons[actualIndex].state,
        country: persons[actualIndex].country,
        url: persons[actualIndex].website,
        social_facebook: persons[actualIndex].social_facebook,
        social_twitter: persons[actualIndex].social_twitter,
        social_other: persons[actualIndex].social_other,
        emphasis: persons[actualIndex].emphasis,
        hymn_soc_member: persons[actualIndex].hymn_soc_member,
        high_level: persons[actualIndex].high_level,
        is_active: persons[actualIndex].is_active,
        approved: persons[actualIndex].approved,
        user_id: persons[actualIndex].user_id,
        user: persons[actualIndex].user,
        pract_schol: persons[actualIndex].pract_schol,

        languages: personLangs_all[0][actualIndex],
        instruments: personInstruments_all[0][actualIndex],
        categories: personCategories_all[0][actualIndex],
        ensembles: personEnsembles_all[0][actualIndex],
        ethnicities: personEthnicities_all[0][actualIndex],
        topics: personTopics_all[0][actualIndex],
        tags: personTags_all[0][actualIndex]

    };

    personData.hymn_soc_member = reformatTinyInt(personData.hymn_soc_member);
    personData.is_active = reformatTinyInt(personData.is_active);
    personData.high_level = reformatTinyInt(personData.high_level);
    personData.approved = reformatTinyInt(personData.approved);

    var theUrl = "/person/" + String(persons[actualIndex].id);

    var finalObj = {
        url: theUrl,
        data: personData
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

//BELOW is for the POST request
function insertFirst(toInsert, _callback) {

    insertPerson(toInsert);

    _callback();
}

function insertAndGet(toInsert, callback) {

    insertFirst(toInsert, function() {
        connection.query(`SELECT * from persons`, function(err, rows, fields) {
            if (err) { callback(err, null); }

            var JSObj = rowsToJS(rows);

            callback(null, JSObj[JSObj.length - 1].id); //get the last element's id

        });

    });
}


//PERSON POST REQUEST
personController.postConfig = {
    //auth: 'high_or_admin',
    handler: function(req, reply) {

            //getPersonsJSON();

            var thePersonID = persons.length + 1;

            var theData = {
                first_name: req.payload.data.first_name,
                last_name: req.payload.data.last_name,
                email: req.payload.data.email,
                city: req.payload.data.city,
                state: req.payload.data.state,
                country: req.payload.data.country,
                website: req.payload.data.url,
                social_facebook: req.payload.data.social_facebook,
                social_twitter: req.payload.data.social_twitter,
                social_other: req.payload.data.social_other,
                emphasis: req.payload.data.emphasis,
                hymn_soc_member: req.payload.data.hymn_soc_member,
                high_level: req.payload.data.high_level,
                user_id: req.payload.uid,
                user: req.payload.user,
                is_active: true,
                pract_schol: req.payload.data.pract_schol,

                languages: req.payload.data.languages,
                instruments: req.payload.data.instruments,
                categories: req.payload.data.categories,
                ensembles: req.payload.data.ensembles,
                ethnicities: req.payload.data.ethnicities,
                topics: req.payload.data.topics,
                tags: req.payload.data.tags

            };

            insertAndGet(theData, (err, theID) => {
                var toReturn = {

                    person_id: theID,
                    id_of_matches_found: []
                }

                var lookForDuplicate = require('../../controllers/shared/check-for-duplicates')("persons", theData, (err, results) => {
                    if (err) { console.log("ERROR: ", err); }
                    //results is an array of id's of matching resources/congrgations/etc.
                    //if it is empty, then there were no matches found
                    else {
                        toReturn.id_of_matches_found = results;
                    }

                    return reply(toReturn);
                });
            });

        }
        /* ADD COMMA ^
  validate: {
    payload: {
      title: 	Joi.string().required(),
      url: 	Joi.string().required(),
      description: Joi.string().required(),
      author: 	Joi.string().allow(''),

      ethnicities: Joi.array().allow(''),
      categories: Joi.array().allow(''),
      topic: 	Joi.array().allow(''),
      accompaniment: Joi.array().allow(''),
      languages: Joi.array().allow(''),
      ensembles: Joi.array().allow(''),
      parent: 	Joi.string().allow(''),
      hymn_soc_member: Joi.string().allow('')

    }
  }
*/
};

//delete
personController.deleteConfig = {
    //auth: 'admin_only',
    handler: function(req, reply) {
            var query = connection.query(`DELETE FROM persons WHERE id=${req.params.id}`, function(err, rows, fields) {
                if (err) { return reply(Boom.badRequest("error when deleting from persons")); }
                return reply({
                    code: 202,
                    message: `Successfully deleted persons with id=${req.params.id}`
                });
            });
        } //end handler
};

personController.updateConfig = {
    //auth: 'admin_only',
    handler: function(request, reply) {
            var thePersonID = persons.length + 1;

            if (request.params.id) {

                //if (events.length <= request.params.id - 1) return reply('Not enough events in the database for your request').code(404);
                var actualIndex = Number(request.params.id - 1); //if you request for events/1 you'll get events[0]

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
        UPDATE persons SET ?
        WHERE ?`, [{
                    [theCol]: theVal
                }, { id: mysqlIndex }], function(err, rows, fields) {
                    if (err) {
                        //console.log(query.sql);
                        return reply(Boom.badRequest(`invalid query when updating persons on column ${request.payload.what_var} with value = ${request.payload.what_val} `));
                    } else {
                        //getPersonsJSON();
                        //console.log(query.sql);
                        //console.log("set person #", mysqlIndex, ` variable ${theCol} = ${theVal}`);
                    }

                    return reply({ statusCode: 201 });
                });

                //return reply(persons[actualId]);
            }
        } //handler
}

//PERSON GET REQUEST
personController.getApprovedConfig = {

    handler: function(request, reply) {

        connection.query(`SELECT * from persons`, function(err, rows, fields) {
            if (!err) {
                var JSObj = rowsToJS(rows);
                persons = [];
                personTopics = [];
                personEnsembles = [];
                personEthnicities = [];
                personInstruments = [];
                personCategories = [];
                personTags = [];
                personLangs = [];
                persons = JSObj;
                numPersons = persons.length;
                //console.log("\nT: ", rows[0]);
                for (var i = 0; i < JSObj.length; i++) {
                    popArray(JSObj[i]["ethnicities"], personEthnicities);
                    popArray(JSObj[i]["categories"], personCategories);
                    popArray(JSObj[i]["topics"], personTopics);
                    popArray(JSObj[i]["ensembles"], personEnsembles);
                    popArray(JSObj[i]["tags"], personTags);
                    popArray(JSObj[i]["instruments"], personInstruments);
                    popArray(JSObj[i]["languages"], personLangs);

                    personEthnicities_all.push(personEthnicities);
                    personCategories_all.push(personCategories);
                    personTopics_all.push(personTopics);
                    personEnsembles_all.push(personEnsembles);
                    personTags_all.push(personTags);
                    personInstruments_all.push(personInstruments);
                    personLangs_all.push(personLangs);
                }

            } else {
                return reply(Boom.badRequest());
            }

            //console.log("\n\nETHS[", persons.length-1, "] => ",personEthnicities[persons.length-1]);

            if (request.params.id) {
                if ((numPersons <= request.params.id - 1) || (0 > request.params.id - 1)) {
                    //return reply('Not enough Persons in the database for your request').code(404);
                    return reply(Boom.notFound("Index out of range for Persons get request"));
                }
                var actualIndex = Number(request.params.id - 1);

                //create new object, convert to json

                if (persons[actualIndex].approved == 1) {
                    var str = formatPerson(actualIndex);
                    return reply(str);
                } else {
                    return reply(Boom.badRequest("The Person you request is already approved"));
                }


                //return reply(persons[actualId]);
            }

            //if no ID specified
            var objToReturn = [];

            for (var i = 0; i < persons.length; i++) {
                //var bob = formatResource(i);

                if (persons[i].approved == 1) {
                    var str = formatPerson(i);
                    objToReturn.push(str);
                }
            } //end for

            //console.log(objToReturn);
            if (objToReturn.length <= 0) {
                return reply(Boom.badRequest("All resources already approved, nothing to return"));
            } else {
                reply(objToReturn);
            }
        });
    }
};

personController.editConfig = {
    //auth: 'high_or_admin',
    handler: function(req, reply) {

            var theData = {
                user_id: req.payload.uid,
                user: req.payload.user,

                first_name: req.payload.data.first_name, //
                last_name: req.payload.data.last_name, //
                email: req.payload.data.email, //
                city: req.payload.data.city, //
                state: req.payload.data.state, //
                country: req.payload.data.country, //
                website: req.payload.data.url, //
                social_facebook: req.payload.data.social_facebook, //
                social_twitter: req.payload.data.social_twitter, //
                social_other: req.payload.data.social_other, //
                emphasis: req.payload.data.emphasis, //
                hymn_soc_member: req.payload.data.hymn_soc_member, //
                high_level: req.payload.data.high_level,
                is_active: true,
                pract_schol: req.payload.data.pract_schol, //
                approved: req.payload.data.approved,

                languages: req.payload.data.languages, //
                instruments: req.payload.data.instruments, //
                categories: req.payload.data.categories, //
                ensembles: req.payload.data.ensembles, //
                ethnicities: req.payload.data.ethnicities, //
                topics: req.payload.data.topics, //
                tags: req.payload.data.tags

            };

            var justPerson = JSON.parse(JSON.stringify(theData));

            justPerson.categories = JSON.stringify(justPerson.categories);
            justPerson.topics = JSON.stringify(justPerson.topics);
            justPerson.ethnicities = JSON.stringify(justPerson.ethnicities);
            justPerson.tags = JSON.stringify(justPerson.tags);
            justPerson.ensembles = JSON.stringify(justPerson.ensembles);
            justPerson.instruments = JSON.stringify(justPerson.instruments);
            justPerson.languages = JSON.stringify(justPerson.languages);

            // TYPE CONVERSION
            if (typeof justPerson.hymn_soc_member == "string") {
                if (justPerson.hymn_soc_member == "no" || justPerson.hymn_soc_member == "No" || justPerson.hymn_soc_member == "false" || justPerson.hymn_soc_member == "False") {
                    justPerson.hymn_soc_member = 0;
                } else if (justPerson.hymn_soc_member == "partially" || justPerson.hymn_soc_member == "Partially") {
                    justPerson.hymn_soc_member = 2;
                } else {
                    justPerson.hymn_soc_member = 1;
                }
            } else if (typeof justPerson.hymn_soc_member !== "number") {
                justPerson.hymn_soc_member = 2;
            }

            if (typeof justPerson.pract_schol == "string") {
                if (justPerson.pract_schol == "practical" || justPerson.pract_schol == "Practical") {
                    justPerson.pract_schol = 0;
                } else if (justPerson.pract_schol == "Scholarly" || justPerson.pract_schol == "scholarly") {
                    justPerson.pract_schol = 1;
                } else {
                    justPerson.pract_schol = 2;
                }
            }

            //if (events.length <= request.params.id - 1) return reply('Not enough events in the database for your request').code(404);

            try {
                if (req.params.id) {
                    connection.query(`SELECT approved FROM persons WHERE id = ?`, [req.params.id], (err, rows, fields) => {
                        if (err) { return reply(Boom.badRequest(err)); } else {
                            if (rows.length > 0) {
                                try {
                                    var isApproved = rowsToJS(rows)[0].approved;
                                    if (isApproved == 1) {
                                        justPerson.approved = 1;
                                    } else {
                                        justPerson.approved = 0;
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
    UPDATE persons SET ?
    WHERE ?`, [justPerson, { id: req.params.id }], function(err, rows, fields) {
                if (err) {
                    //console.log(query.sql);
                    return reply(Boom.badRequest(`invalid query when updating persons with id = ${req.payload.id} `));
                } else {
                    //console.log(query.sql);
                    //console.log("set person #", req.params.id);
                }

                return reply({ statusCode: 201 });
            });





        }
        /* ADD COMMA ^
  validate: {
    payload: {
      title: 	Joi.string().required(),
      url: 	Joi.string().required(),
      description: Joi.string().required(),
      author: 	Joi.string().allow(''),

      ethnicities: Joi.array().allow(''),
      categories: Joi.array().allow(''),
      topic: 	Joi.array().allow(''),
      accompaniment: Joi.array().allow(''),
      languages: Joi.array().allow(''),
      ensembles: Joi.array().allow(''),
      parent: 	Joi.string().allow(''),
      hymn_soc_member: Joi.string().allow('')

    }
  }
*/

}

personController.addTagConfig = {
    //auth:
    handler: function(request, reply) {
        connection.query(`SELECT id FROM persons`, (err, rows, fields) => {
            if (err) { return reply(Boom.badRequest("error selecting persons in updateConfig")); }
            if (request.params.id) {

                //console.log("request.payload.tag: ", request.payload.tag);
                var receivedtag = request.payload.tag; //receive tag from body, parse to JSObj

                //get existing tag
                connection.query(`SELECT tags FROM persons WHERE id = ?`, [request.params.id], (err, rows, fields) => {
                    if (err) { return reply(Boom.badRequest("error selecting tag from person")); }
                    //console.log("rows[0]: ", rowsToJS(rows[0].tag));
                    if (rowsToJS(rows[0].tags) !== null) {
                        var currenttag = JSON.parse(rows[0].tags);
                    } else {
                        var currenttag = [];
                    }

                    currenttag.push(receivedtag);

                    connection.query(`UPDATE persons SET tags = ? WHERE id = ?`, [JSON.stringify(currenttag), request.params.id], (err, rows, fields) => {
                        if (err) { return reply(Boom.badRequest("error adding tag to person")); }
                        return reply({ statusCode: 201 });

                    });

                });



            } else {
                return reply(Boom.notFound("must supply and id as a parameter"));

            }
        });
    }

};

//var postQuizController = require('../../controllers/persons/post-quiz-person').postQuiz;

var postQuizController = require('../../controllers/post-quiz-then-get').postQuizPersons;
var getUnapprovedRes = require('../../controllers/persons/get-persons').getUnapprovedpersons;
var getApprovedRes = require('../../controllers/persons/get-persons').getApprovedpersons;
var addValueConfig = require('../../controllers/shared/add-values').persons;

var searchResourceConfig = require('../../controllers/search.js').searchPersons;

module.exports = [
    { path: '/person', method: 'POST', config: personController.postConfig },
    { path: '/person/{id?}', method: 'GET', config: getUnapprovedRes },
    { path: '/person/approved/{id?}', method: 'GET', config: getApprovedRes },
    { path: '/person/{id}', method: 'DELETE', config: personController.deleteConfig },
    { path: '/person/{id}', method: 'PUT', config: personController.editConfig },
    { path: '/person/update/{id}', method: 'PUT', config: personController.updateConfig },
    { path: '/quiz/person', method: 'POST', config: postQuizController },
    { path: '/person/addvalues/{id}', method: 'PUT', config: addValueConfig },
    { path: '/person/search', method: 'POST', config: searchResourceConfig }


];