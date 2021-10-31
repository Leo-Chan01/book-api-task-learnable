/*
This is where all functionalities are implemented, every other thing is 
accessed through this class
*/

var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var routeHandler = require('./lib/book_handler');
var helper = require('./lib/helper');
var config = require('./lib/config');
var fs = require('fs');

//now we start the server
var server = http.createServer(function(req, res) {

    var resultUrl = url.parse(req.url, true);
    var path = resultUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //querying the url
    var queryStringObject = resultUrl.query;

    var method = req.method.toLowerCase();

    var header = req.headers;

    //Get Payload
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data) {
        buffer += decoder.write(data);
    });
    req.on('end', function() {
        buffer += decoder.end();

        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : router.notfound;

        var data = {
            'trimmedPath': trimmedPath,
            'query': queryStringObject,
            'method': method,
            'headers': header,
            'payload': helper.parseJsonToObject(buffer)
        };

        chosenHandler(data, function(statusCode, payload) {

            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            payload = typeof(payload) == 'object' ? payload : {};

            var responseObj = JSON.stringify(payload);

            res.setHeader('Content-Type', "application/json");
            res.writeHead(statusCode);

            res.write(responseObj);
            res.end();

            console.log('request received with this response', statusCode, responseObj);
        });
    });
});

//start the server
server.listen(config.port, function() {
    console.log("Server started on Port: " + config.port + " in " + config.envName + " mode");
})

//router implementation
var router = {
    'ping': routeHandler.ping,
    'users': userHandler.users,
    'books': routeHandler.books,
    'notfound': routeHandler.notfound,
    'tokens': userHandler.tokens
}