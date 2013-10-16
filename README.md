# alldata-peer-client-http

_Stability: 1 - [Experimental](https://github.com/tristanls/stability-index#stability-1---experimental)_

[![NPM version](https://badge.fury.io/js/alldata-peer-client-http.png)](http://npmjs.org/package/alldata-peer-client-http)

Peer Client HTTP module for [AllData](https://github.com/tristanls/alldata), a distributed master-less write-once immutable event store database implementing "All Data" part of [Lambda Architecture](http://www.slideshare.net/nathanmarz/runaway-complexity-in-big-data-and-a-plan-to-stop-it).

## Usage

```javascript
var AllDataPeerClient = require('alldata-peer-client-http');
var AllDataKeygen = require('alldata-keygen');

var allDataPeerClient = new AllDataPeerClient({
    method: "POST",
    path: "/_put",
    port: 80 
});

var event1 = {customer: 1, action: "site visit"};
var key1 = AllDataKeygen.createKey();

allDataPeerClient._put({hostname: "first.peer.com"}, key1, event1, function (error) {
    if (error) {
        console.log("Saving event1 failed on first peer: " + error.message);
    } else {
        console.log("Saving event1 succeeded on first peer.");
    }
});

allDataPeerClient._put({hostname: "second.peer.com"}, key1, event1, function (error) {
    if (error) {
        console.log("Saving event1 failed on second peer: " + error.message);
    } else {
        console.log("Saving event1 succeeded on second peer.");
    }
});
```

## Test

    npm test

## Overview

AllDataPeerClient is a Peer HTTP client for [AllData](https://github.com/tristanls/alldata). Once configured, it generates `_put` requests to other peers via HTTP in order to implement various consistency levels for AllData.

## Documentation

### AllDataClient

**Public API**

  * [new AllDataPeerClient(options)](#new-alldatapeerclientoptions)
  * [allDataPeerClient._put(options, key, event, callback)](#alldatapeerclient_putoptions-key-event-callback)

### new AllDataPeerClient(options)

  * `options`: _Object_
    * `method`: _String_ _(Default: `POST`)_ HTTP method.
    * `path`: _String_ _(Default: `/`)_ HTTP request path.
    * `port`: _Number_ _(Default: 80)_ HTTP port of remote server.

Creates a new instance of AllDataPeerClient.

### allDataPeerClient._put(options, key, event, callback)

  * `options`: _Object_ HTTP options specific to this `_put`.
    * `hostname`: _String_ HTTP hostname of the AllData peer.
    * `method`: _String_ _(Default: as specified in constructor `options.method`)_ HTTP method.
    * `path`: _String_ _(Default: as specified in constructor `options.path`)_ HTTP request path.
    * `port`: _Integer_ _(Default: as specified in constructor `options.port`)_ HTTP port of remote server.
  * `event`: _Object_ JavaScript object representing the event to store.
  * `callback`: _Function_ `function (error) {}` Callback to call in case of success or failure.

Attempts to store the `event` with specified `key` at AllData peer specified in `options.hostname` via HTTP. `callback` must be provided and it will be called with an `Error` instance if an error occurs or with no parameters otherwise.

```javascript
allDataPeerClient.put({hostname: "first.peer.com"}, key1, event1, function (error) {
    if (error) console.log('put failed: ' + error.message); 
});
```