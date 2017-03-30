"use strict";

var Hapi = require('hapi');
var Bcrypt = require('bcryptjs');
var Boom = require('boom');
var Joi = require('joi');
var mysql = require('mysql');
var async = require('async');
const fs = require('fs');
var BasicAuth = require('hapi-auth-basic')
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

function rowsToJS(theArray) {
    var temp = JSON.stringify(theArray);
    temp = JSON.parse(temp);
    //console.log(temp);
    return temp;
}

function checkForTrue(obj, callback) {
    var tempArray = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key] == true) {
                tempArray.push(key);
            }
        }
    }
    callback(null, tempArray)
}

module.exports.postQuiz = {
    handler: function(request, reply) {

            //1. Receive quiz request

            //2. create seperate arrays for 
            //categories, instruments, ensembles and ethnicities which will be
            //cross-referenced with resources' attributes

            //3. A dictionary will be created that maps the resourceID -> number of matches from step 2)

            //4. After all resources have been checked, loop thru dict (from step 4), return top 5 matches

            //1,2:
            var receivedQuiz = request.payload.quiz;

            var quiz_categories = [];
            var quiz_instruments = [];
            var quiz_ensembles = [];
            var quiz_ethnicities = [];

            var resID_dict = {};

            checkForTrue(receivedQuiz["categories"], (err, valuesToPush) => {
                if (err) { throw err; }
                if (valuesToPush.length > 0) {
                    for (var i in valuesToPush)
                        quiz_categories.push(valuesToPush[i]);
                } else { console.log("no categories received"); }
            });
            checkForTrue(receivedQuiz["ethnicities"], (err, valuesToPush) => {
                if (err) { throw err; }
                if (valuesToPush.length > 0) {
                    for (var i in valuesToPush)
                        quiz_ethnicities.push(valuesToPush[i]);
                } else { console.log("no ethnicities received"); }
            });
            checkForTrue(receivedQuiz["instruments"], (err, valuesToPush) => {
                if (err) { throw err; }
                if (valuesToPush.length > 0) {
                    for (var i in valuesToPush)
                        quiz_instruments.push(valuesToPush[i]);
                } else { console.log("no instruments received"); }
            });
            checkForTrue(receivedQuiz["ensembles"], (err, valuesToPush) => {
                if (err) { throw err; }
                if (valuesToPush.length > 0) {
                    for (var i in valuesToPush)
                        quiz_ensembles.push(valuesToPush[i]);
                } else { console.log("no ensembles received"); }
            });

            //console.log("ensembles: ", quiz_ensembles);

            //now step 1 and 2 are complete, commence step 2b, which is
            //select * approved resources, go through rows, parse categories, topics, etc
            //into temporary arrays which will be cross-referenced with quiz_categories, etc.

            var query = connection.query(`SELECT 
			id, categories, topics, accompaniment, ensembles, ethnicities 
			FROM resources WHERE approved = 1`, (err, rows, fields) => {
                if (err) { return reply(Boom.badRequest("error getting resources in post-quiz-resource")); }
                if (rows.length <= 0) { return reply(Boom.badRequest("There are no approved resources")); }
                var jsobj = rowsToJS(rows);

                var tempArray = [];
                var toCheck = ["categories", "topics", "accompaniment", "ensembles", "ethnicities"];
                for (var i in jsobj) { //loop thru every resource
                    for (var whichCol in toCheck) { //loop through every column (see the array 2 lines above...)
                        var currentCol = toCheck[whichCol];
                        jsobj[i][currentCol] = JSON.parse(jsobj[i][currentCol]);

                        for (var key in jsobj[i][currentCol]) { //loop through every element of the current column
                            //console.log(key, " -> ", jsobj[i][currentCol][key]);
                            if (jsobj[i][currentCol].hasOwnProperty(key)) {
                                var theVal = jsobj[i][currentCol][key]; //the corresponding value to the key:value pair that is either true, false, or a string (for other)
                                if (key == 'Other' || key == 'other') {
                                    tempArray.push(jsobj[i][currentCol][key]);
                                } else if (theVal == 'True' || theVal == true || theVal == 'true' || theVal == 1) {

                                    key = key.replace(/_/g, " ");
                                    //console.log(key, " -> ", theVal);
                                    tempArray.push(key);
                                    //add to dictionary if there is a match
                                    if (currentCol == "categories" || currentCol == "topics") {
                                        for (var j in quiz_categories) {
                                            if (quiz_categories[j] == key) {
                                                console.log("matching ", currentCol);
                                                if (jsobj[i].id in resID_dict) {
                                                    resID_dict[jsobj[i].id] = resID_dict[jsobj[i].id] + 1;
                                                } else {
                                                    console.log("doesn't exist yet, so create...");
                                                    resID_dict[jsobj[i].id] = 1;
                                                }
                                            }
                                        }
                                    } else if (currentCol == "accompaniment") {
                                        for (var j in quiz_instruments) {
                                            if (quiz_instruments[j] == key) {
                                                if (jsobj[i].id in resID_dict) {
                                                    console.log("matching instrument");
                                                    resID_dict[jsobj[i].id] = resID_dict[jsobj[i].id] + 1;
                                                } else {
                                                    console.log("doesn't exist yet, so create...");
                                                    resID_dict[jsobj[i].id] = 1;
                                                }
                                            }
                                        }
                                    } else if (currentCol == "ensembles") {
                                        for (var j in quiz_ensembles) {
                                            if (quiz_ensembles[j] == key) {
                                                if (jsobj[i].id in resID_dict) {
                                                    console.log("matching ensemble");
                                                    resID_dict[jsobj[i].id] = resID_dict[jsobj[i].id] + 1;
                                                } else {
                                                    console.log("doesn't exist yet, so create...");
                                                    resID_dict[jsobj[i].id] = 1;
                                                }
                                            }
                                        }
                                    } else if (currentCol == "ethnicities") {
                                        for (var j in quiz_ethnicities) {
                                            if (quiz_ethnicities[j] == key) {
                                                console.log("matching ethnicity");
                                                if (jsobj[i].id in resID_dict) {
                                                    resID_dict[jsobj[i].id] = resID_dict[jsobj[i].id] + 1;
                                                } else {
                                                    console.log("doesn't exist yet, so create...");
                                                    resID_dict[jsobj[i].id] = 1;
                                                }
                                            }
                                        }
                                    }

                                } else {
                                    //false, dont add...
                                }
                            }
                        } //now we are done looping thru a certain column for a single resource
                        tempArray = [];



                    } //done looping thru a column
                    //NOW we are done getting all columns for the current single resource...
                    //find number of matches
                    tempArray = [];

                    //console.log("array for ", i, ": ", tempArray, "\n");
                    //done with resource, empty array
                } //end looping thru every resource

                console.log("dict: ", resID_dict);

                reply("okay");
            });


        } //end handler
}