/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 © NVISIA, LLC.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * @author jgitter
 */

var express = require('express');
var app = express();

var _ = require('underscore');

// connect to the data store needed for this application
var DB = require('nedb');
var db = {};
db.restaurants = new DB({
    filename: './server/restaurants.db',
    autoload: true
});
db.reservations = new DB({
    filename: './server/reservations.db',
    autoload: true
});
global.db = db;

var restaurantService = require('./restaurantService.js');
var reservationService = require('./reservationService.js');

// parse command line options
var opts = require('stdio').getopt({
    'port': {key: 'p', args: 1, description: 'HTTP Listener Bind Port'}
});

// application routes
// verb -> path -> function(s)
var baseRoutes = {
    'get': {
        '/': function(req, res) {
            res.sendfile('/.webapp/index.html');
        },
        '/index.html': function(req, res) {
            res.redirect('/');
        }
    }
};
var restaurantServiceRoutes = {
    'get': {
        '/restaurants': restaurantService.getRestaurants,
        '/restaurants/:id': restaurantService.getRestaurants,
        '/restaurants/:id/reservations': restaurantService.getReservations
    },
    'put': {
        '/restaurants': restaurantService.saveRestaurant,
        '/restaurants/:id': restaurantService.saveRestaurant
    },
    'delete': {
        '/restaurants/:id': restaurantService.deleteRestaurant
    }
};
var reservationServiceRoutes = {
    'get': {
        '/reservations/:id': reservationService.getReservations
    },
    'put': {
        '/reservations': reservationService.saveReservation,
        '/reservations/:id': reservationService.saveReservation
    },
    'delete': {
        '/reservations/:id': reservationService.deleteReservation
    }
};

app.use(express.bodyParser());
app.use(express.static(__dirname + '/../webapp'));

// add all of the routes to the application
var addRoutes = function(routes) {
    _.each(routes, function (paths, verb) {
        _.each(paths, function(fn, path) {
            app[verb](path, fn);
        });
    });
};
addRoutes(baseRoutes);
addRoutes(restaurantServiceRoutes);
addRoutes(reservationServiceRoutes);

// start the server
var port = opts.port;
if (port === undefined) {
    console.log('Port not specified.  Defaulting to 9000');
    port = 9000;
}
app.listen(port);
console.log('Listening on port ' + port);
