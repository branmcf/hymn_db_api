"use strict";

var Hapi = require('hapi');
var Bcrypt = require('bcryptjs');
var Boom = require('boom');
var Joi = require('joi');
var mysql = require('mysql');
var async = require('async');
const fs = require('fs');
var BasicAuth = require('hapi-auth-basic');
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

//pass in a type (resource vs cong vs event etc.) with the actual object
//if a match is found, a match wil be returned, otherwise a 0 will be returned
//an error will be returned if an error is encountered
module.exports = function(which_table, resource, callback) {
    //columns_to_check has attributes shared by all except persons
    var columns_to_check = ["name", "website", "parent", "city", "state"];
    var defining_columns = [];
    switch (which_table) {
        case "resources":
            {
                columns_to_check.push("type", "author");
                defining_columns = [
                    ["type", "author"]
                ];
                break;
            }
        case "events":
            {
                columns_to_check.push("type", "theme", "event_date", "event_end_date");
                defining_columns = [
                    ["parent", "theme"]
                ];
                break;
            }
        case "organizations":
            {
                columns_to_check.push("denomination", "mission", "process");
                defining_columns = [
                    ["parent", "denomination"]
                ];
                break;
            }
        case "congregations":
            {
                columns_to_check.push("denomination", "process");
                defining_columns = [
                    ["denomination", "process"]
                ];
                break;
            }
        case "persons":
            {
                columns_to_check = ["city", "state", "first_name", "last_name", "email", "website", "social_facebook", "social_twitter", "social_other"];
                defining_columns = ["social_facebook", "social_twitter", "social_other", ["first_name", "last_name"]];
                break;
            }
        default:
            {
                return callback(Boom.badData("which_table is invalid in check-for-duplicates"), null);
            };
    } //end switch statement

    //now get all approved AND unapproved resources in the Db to compare to...
    var query = connection.query(`SELECT 
			id, ${columns_to_check}
			FROM ${which_table}`, (err, rows, fields) => {
        if (err) { return callback(err, null); }
        if (rows.length <= 0) { return callback(true, null); }
        try {
            //pop last element because we don't want to compare the resource against itself...
            rows.pop();
        } catch (e) {
            console.log("couldn't pop last element of array: ", e);
        }
        var all_resources = rowsToJS(rows);

        //resource(passed in this function's parameter) is the 'resource' that we will use to compare previous entries to,
        //in order to find a possible duplicate
        var matches_found = {};
        /*
        Structure of matches_found:
        {
            "resource_id" : ["column_name", "column_name", "column_name"],
            "resource_id" : ["column_name"],
            ...        
        }

        */

        //loop through each existing resource
        for (var resource_index in all_resources) {
            //console.log("all_resources[resource_index]: ", all_resources[resource_index]);
            for (var column_index in columns_to_check) {
                let current_column = columns_to_check[column_index];
                //console.log("all_resources[resource_index][current_column] == ", all_resources[resource_index][current_column]);
                //console.log("\n==========");
                //console.log("all_resources[resource_index][current_column]: ", all_resources[resource_index][current_column]);
                //console.log("resource[current_column]: ", resource[current_column]);
                if (all_resources[resource_index][current_column] == resource[current_column] && resource[current_column] !== undefined && all_resources[resource_index][current_column] !== undefined) {

                    //add object's id to matches_found list of keys
                    var theID = all_resources[resource_index]["id"];
                    console.log("theID = ", theID, "and current_column = ", current_column);

                    //see if the id is already in matches_found...
                    if (matches_found[theID]) {
                        let tempArray = [];
                        if (typeof matches_found[theID] == "string") {
                            tempArray.push(matches_found[theID]);
                            tempArray.push(current_column);
                            matches_found[theID] = tempArray;
                        } else if (Array.isArray(matches_found[theID])) {
                            console.log("\nFOUND ARRAY: ", matches_found[theID]);
                            for (var item in matches_found[theID]) {
                                console.log("pushing: ", matches_found[theID][item]);
                                tempArray.push(matches_found[theID][item]);
                                if (tempArray.includes(current_column)) {
                                    //already contains current_column so don't add a duplicate...
                                } else {
                                    tempArray.push(current_column);
                                }
                            }
                            matches_found[theID] = tempArray;
                        } else {
                            console.log("IDK... type = ", typeof matches_found[theID]);
                        }
                    } else {
                        //does not exist yet, so add it...
                        matches_found[theID] = [current_column];
                    }

                    /*
                    if (all_resources[resource_index]["id"] in matches_found) {
                        console.log("CREATING...", [current_column]);
                        matches_found[all_resources[resource_index]["id"]] = [current_column];
                    } else {
                        //if it already exists, just increment it...
                        console.log("ADDING TO: ", matches_found[all_resources[resource_index]["id"]]);
                        matches_found[all_resources[resource_index]["id"]].push(current_column);
                    }
                    */
                }
            }
        }

        console.log("matches_found: ", matches_found);

        var toReturn = []; //will contain the id of the existing resource that contains matches with what was passed in...
        var arrayOfIDmatches = [];
        for (var id_key in matches_found) {
            if (matches_found.hasOwnProperty(id_key)) {
                arrayOfIDmatches.push(id_key);
            }
        }

        //now loop through each KEY (which is a resource id) in matches_found and cross reference with defining_columns...
        //if there are matches, then there is likely a duplicate resource...
        /*
        for (var found_key in matches_found) {
            if (matches_found.hasOwnProperty(found_key)) {
                for (var defining_index in defining_columns) {
                    if (matches_found[found_key] == defining_columns[defining_index]) {
                        //match found... :O
                        //trigger some function or callback that would return an indication that there might be a duplicate present...
                        console.log("FOUND MATCH...", matches_found[found_key], " == ", defining_columns[defining_index]);
                        toReturn.push(found_key);
                    }
                }
            }
        }
        */

        //just return an array of ID matches for now...
        return callback(null, arrayOfIDmatches);
    });

}