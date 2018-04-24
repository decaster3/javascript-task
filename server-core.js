const express = require('express');
const bodyParser = require('body-parser');
const database = require('./database');
const app = express();

app.use(bodyParser.json());
app.route('/messages')
    .get(function(request, response) {
        let result = database;
        if (request.query.from !== undefined) {
            result = result.filter(function(elem) {
                return elem.from && elem.from === request.query.from;
            })
        }
        if (request.query.to !== undefined) {
            result = result.filter(function(elem) {
                return elem.to && elem.to === request.query.to;
            })
        }
        response.status(200).send(result);
    })
    .post(function (request, response) {
        const message = {};
        if (request.query.from) {
            message.from = request.query.from;
        }
        if (request.query.to) {
            message.to = request.query.to;
        }
        message.text = request.body.text;
        database.push(message);
        response.status(201).send(message);
    })
    .all(function (request, response) {
        response.status(405).end();
    });


app.all('*', function (request, responce) {
    responce.sendStatus(404);
});

module.exports = app;
