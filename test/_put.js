/*

_put.js - allDataPeerClient._put(options, key, event, callback) test

The MIT License (MIT)

Copyright (c) 2013 Tristan Slominski

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/

"use strict";

var AllDataPeerClient = require('../index.js'),
    http = require('http');

var test = module.exports = {};

test["_put() connects to hostname HTTP server using constructor options"] = function (test) {
    test.expect(2);
    var allDataPeerClient = new AllDataPeerClient({
        method: "PUT",
        path: "/_put",
        port: 8080
    });
    var server = http.createServer();
    server.on('request', function (req, res) { 
        test.equal(req.method, "PUT");
        test.equal(req.url, "/_put");
        // close the conneciton
        res.end();
        server.close(function () {
            test.done();
        });
    });
    server.listen(8080, 'localhost', function () {
        allDataPeerClient._put({hostname: 'localhost'}, 'key1', {foo: 'bar'},
            function (error) {});
    });
};

test["_put() sends {key: key, event: event} as JSON in POST body"] = function (test) {
    test.expect(2);
    var allDataPeerClient = new AllDataPeerClient({
        port: 8080
    });
    var server = http.createServer();
    server.on('request', function (req, res) { 
        var data = "";
        req.on('data', function (chunk) {
            data += chunk.toString('utf8');
        });
        req.on('end', function () {
            data = JSON.parse(data);
            test.deepEqual(data.key, 'key1');
            test.deepEqual(data.event, {foo: 'bar'});
            res.end();
            server.close(function () {
                test.done();
            });
        });
    });
    server.listen(8080, 'localhost', function () {
        allDataPeerClient._put({hostname: 'localhost'}, 'key1', {foo: 'bar'},
            function (error) {});
    });
};

test["_put() calls error callback if response is not 201"] = function (test) {
    test.expect(1);
    var allDataPeerClient = new AllDataPeerClient({
        port: 8080
    });
    var server = http.createServer(function (req, res) {
        res.statusCode = 200;
        res.end();
    });
    server.listen(8080, 'localhost', function () {
        allDataPeerClient._put({hostname: 'localhost'}, 'key1', {foo: 'bar'}, 
            function (error) {
                test.ok(error);
                server.close(function () {
                    test.done();
                });
            });
    });
};

test["_put() calls error callback if request encounters an error"] = function (test) {
    test.expect(1);
    var allDataPeerClient = new AllDataPeerClient({
        port: 8080
    });
    // no server around
    allDataPeerClient._put({hostname: 'localhost'}, 'key1', {foo: 'bar'}, 
        function (error) {
            test.ok(error);
            test.done();
        });  
};

test["_put() calls success callback if response is 201"] = function (test) {
    test.expect(1);
    var allDataPeerClient = new AllDataPeerClient({
        port: 8080
    });
    var server = http.createServer(function (req, res) {
        res.statusCode = 201;
        res.end();
    });
    server.listen(8080, 'localhost', function () {
        allDataPeerClient._put({hostname: 'localhost'}, 'key1', {foo: 'bar'},
            function (error) {
                test.ok(!error);
                server.close(function () {
                    test.done();
                });
            });
    });
};