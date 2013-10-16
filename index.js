/*

index.js - "alldata-peer-client-http": AllData Peer HTTP client module

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

var events = require('events'),
    http = require('http'),
    util = require('util');

/*
  * `options`: _Object_
    * `method`: _String_ _(Default: `POST`)_ HTTP method.
    * `path`: _String_ _(Default: `/`)_ HTTP request path.
    * `port`: _Number_ _(Default: 80)_ HTTP port of remote server.
*/
var AllDataPeerClient = module.exports = function AllDataPeerClient (options) {
    var self = this;
    events.EventEmitter.call(self);

    options = options || {};

    self.method = options.method || "POST";
    self.path = options.path || "/";
    self.port = options.port || 80;
};

util.inherits(AllDataPeerClient, events.EventEmitter);

/*
  * `options`: _Object_ HTTP options specific to this `_put`.
    * `hostname`: _String_ HTTP hostname of the AllData peer.
    * `method`: _String_ _(Default: as specified in constructor `options.method`)_ 
            HTTP method.
    * `path`: _String_ _(Default: as specified in constructor `options.path`)_ 
            HTTP request path.
    * `port`: _Integer_ _(Default: as specified in constructor `options.port`)_ 
            HTTP port of remote server.
  * `event`: _Object_ JavaScript object representing the event to store.
  * `callback`: _Function_ `function (error) {}` Callback to call in case of 
          success or failure.
*/
AllDataPeerClient.prototype._put = function _put (options, key, event, callback) {
    var self = this;

    options.method = options.method || self.method;
    options.path = options.path || self.path;
    options.port = options.port || self.port;

    var req = http.request(options, function (res) {
        // 201 Created is success
        if (res.statusCode == 201) {
            res.on('data', function () {}); // drain any data
            return callback();
        }

        var data = "";
        res.on('data', function (chunk) {
            data += chunk.toString('utf8');
        });
        res.on('error', function (e) {
            return callback(e);
        });
        res.on('end', function () {
            return callback(new Error(data));
        });
    });

    req.on('error', function (e) {
        return callback(e);
    });

    req.write(JSON.stringify({key: key, event: event}));
    req.end();
};