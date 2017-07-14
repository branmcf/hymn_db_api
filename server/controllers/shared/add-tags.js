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

module.exports.resources = {
    handler: (request, reply) => {
        if (request.params.id) {

            var receivedTags = request.payload.tags; //receive tag from body, parse to JSObj

            //get existing tag
            connection.query(`SELECT tags FROM resources WHERE id = ?`, [request.params.id], (err, rows, fields) => {
                if (err) { return reply(Boom.badRequest(`error selecting tag from resources`)); }
                if (rowsToJS(rows[0].tags) !== null) {
                    var currentTags = JSON.parse(rows[0].tags);
                } else {
                    var currentTags = [];
                }

                if (typeof receivedTags == "string") {
                    currentTags.push(receivedTags);
                } else {
                    for (var rec_tag_index in receivedTags) {
                        currentTags.push(receivedTags[rec_tag_index]);
                    }
                }

                connection.query(`UPDATE resources SET tags = ? WHERE id = ?`, [JSON.stringify(currentTags), request.params.id], (err, rows, fields) => {
                    if (err) { return reply(Boom.badRequest(`error adding tag to resources`)); }
                    return reply({ statusCode: 201 });

                });

            });



        } else {
            return reply(Boom.notFound("must supply and id as a parameter"));

        }
    }
};

module.exports.events = {
    handler: (request, reply) => {
        if (request.params.id) {

            var receivedTags = request.payload.tags; //receive tag from body, parse to JSObj

            //get existing tag
            connection.query(`SELECT tags FROM events WHERE id = ?`, [request.params.id], (err, rows, fields) => {
                if (err) { return reply(Boom.badRequest(`error selecting tag from events`)); }
                if (rowsToJS(rows[0].tags) !== null) {
                    var currentTags = JSON.parse(rows[0].tags);
                } else {
                    var currentTags = [];
                }

                if (typeof receivedTags == "string") {
                    currentTags.push(receivedTags);
                } else {
                    for (var rec_tag_index in receivedTags) {
                        currentTags.push(receivedTags[rec_tag_index]);
                    }
                }

                connection.query(`UPDATE events SET tags = ? WHERE id = ?`, [JSON.stringify(currentTags), request.params.id], (err, rows, fields) => {
                    if (err) { return reply(Boom.badRequest(`error adding tag to events`)); }
                    return reply({ statusCode: 201 });

                });

            });



        } else {
            return reply(Boom.notFound("must supply and id as a parameter"));

        }
    }
};

module.exports.organizations = {
    handler: (request, reply) => {
        if (request.params.id) {

            var receivedTags = request.payload.tags; //receive tag from body, parse to JSObj

            //get existing tag
            connection.query(`SELECT tags FROM organizations WHERE id = ?`, [request.params.id], (err, rows, fields) => {
                if (err) { return reply(Boom.badRequest(`error selecting tag from organizations`)); }
                if (rowsToJS(rows[0].tags) !== null) {
                    var currentTags = JSON.parse(rows[0].tags);
                } else {
                    var currentTags = [];
                }

                if (typeof receivedTags == "string") {
                    currentTags.push(receivedTags);
                } else {
                    for (var rec_tag_index in receivedTags) {
                        currentTags.push(receivedTags[rec_tag_index]);
                    }
                }

                connection.query(`UPDATE organizations SET tags = ? WHERE id = ?`, [JSON.stringify(currentTags), request.params.id], (err, rows, fields) => {
                    if (err) { return reply(Boom.badRequest(`error adding tag to organizations`)); }
                    return reply({ statusCode: 201 });

                });

            });



        } else {
            return reply(Boom.notFound("must supply and id as a parameter"));

        }
    }
};

module.exports.congregations = {
    handler: (request, reply) => {
        if (request.params.id) {

            var receivedTags = request.payload.tags; //receive tag from body, parse to JSObj

            //get existing tag
            connection.query(`SELECT tags FROM congregations WHERE id = ?`, [request.params.id], (err, rows, fields) => {
                if (err) { return reply(Boom.badRequest(`error selecting tag from congregations`)); }
                if (rowsToJS(rows[0].tags) !== null) {
                    var currentTags = JSON.parse(rows[0].tags);
                } else {
                    var currentTags = [];
                }

                if (typeof receivedTags == "string") {
                    currentTags.push(receivedTags);
                } else {
                    for (var rec_tag_index in receivedTags) {
                        currentTags.push(receivedTags[rec_tag_index]);
                    }
                }

                connection.query(`UPDATE congregations SET tags = ? WHERE id = ?`, [JSON.stringify(currentTags), request.params.id], (err, rows, fields) => {
                    if (err) { return reply(Boom.badRequest(`error adding tag to congregations`)); }
                    return reply({ statusCode: 201 });

                });

            });



        } else {
            return reply(Boom.notFound("must supply and id as a parameter"));

        }
    }
};

module.exports.persons = {
    handler: (request, reply) => {
        if (request.params.id) {

            var receivedTags = request.payload.tags; //receive tag from body, parse to JSObj

            //get existing tag
            connection.query(`SELECT tags FROM persons WHERE id = ?`, [request.params.id], (err, rows, fields) => {
                if (err) { return reply(Boom.badRequest(`error selecting tag from persons`)); }
                if (rowsToJS(rows[0].tags) !== null) {
                    var currentTags = JSON.parse(rows[0].tags);
                } else {
                    var currentTags = [];
                }

                if (typeof receivedTags == "string") {
                    currentTags.push(receivedTags);
                } else {
                    for (var rec_tag_index in receivedTags) {
                        currentTags.push(receivedTags[rec_tag_index]);
                    }
                }

                connection.query(`UPDATE persons SET tags = ? WHERE id = ?`, [JSON.stringify(currentTags), request.params.id], (err, rows, fields) => {
                    if (err) { return reply(Boom.badRequest(`error adding tag to persons`)); }
                    return reply({ statusCode: 201 });

                });

            });



        } else {
            return reply(Boom.notFound("must supply and id as a parameter"));

        }
    }
};

function rowsToJS(theArray) {
    var temp = JSON.stringify(theArray);
    temp = JSON.parse(temp);
    //console.log(temp);
    return temp;
}