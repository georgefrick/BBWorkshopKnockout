/**
The MIT License (MIT)


Copyright (c) 2014 © NVISIA, LLC.


Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:


The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.


THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

**/
var express = require('express');
var app = express();

var restaurantService = require('./restaurantService.js');
var reservationService = require('./reservationService.js');

// parse command line options
var opts = require('stdio').getopt({
    'port': {key: 'p', args: 1, description: 'HTTP Listener Bind Port'}
});

app.use(express.bodyParser());

// root
app.get('/', function(req, res) {
    res.sendfile('./webapp/index.html');
});

// redirect to root
app.get('/index.html', function(req, res) {
    res.redirect('/');
});

// setup static js/css/lib file serving
app.use(express.static(__dirname + '/webapp'));
// app.get(/\/(\S+)\.js/, function(req, res) {
//     res.sendfile('./webapp/libs/' + req.params[0] + '.js');
// });

// get all restaurants
app.get('/restaurants', restaurantService.getRestaurants);

// get one restaurant
app.get('/restaurants/:id', restaurantService.getRestaurants);

// create a new restaurant
app.put('/restaurants', restaurantService.saveRestaurant);

// update a restaurant
app.put('/restaurants/:id', restaurantService.saveRestaurant);

// remove a restaurant
app.delete('/restaurants/:id', restaurantService.deleteRestaurant);

// get reservations for a restaurant
app.get('/restaurants/:id/reservations', restaurantService.getReservations);

// get a single reservation
app.get('/reservations/:id', reservationService.getReservations);

// create a new reservation
app.put('/reservations', reservationService.saveReservation);

// update a reservation
app.put('/reservations/:id', reservationService.saveReservation);

// delete a reservation
app.delete('/reservations/:id', reservationService.deleteReservation);

// start the server
var port = opts.port;
if (port === undefined) {
    console.log('Port not specified.  Defaulting to 9000');
    port = 9000;
}
app.listen(port);
console.log('Listening on port ' + port);