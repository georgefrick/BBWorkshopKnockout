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

var restaurantService = require('./server/restaurant.js');
var reservationService = require('./server/reservation.js');

app.use(express.bodyParser());

app.get('/', function(req, res){
    res.sendfile('./webapp/test.html');
});
app.get(/\/(\S+)\.js/, function(req, res) {
    res.sendfile('./webapp/libs/' + req.params[0] + '.js');
});

app.get('/restaurants', restaurantService.getRestaurants);
app.get('/restaurants/:id', restaurantService.getRestaurants);

app.put('/restaurants', restaurantService.saveRestaurant);
app.put('/restaurants/:id', restaurantService.saveRestaurant);

app.delete('/restaurants/:id', restaurantService.deleteRestaurant);

app.get('/restaurants/:id/reservations', restaurantService.getReservations);

app.get('/reservations/:id', reservationService.getReservations);

app.put('/reservations', reservationService.saveReservation);
app.put('/reservations/:id', reservationService.saveReservation);

app.delete('/reservations/:id', reservationService.deleteReservation);

app.listen(9000);
console.log('Listening on port 9000');
