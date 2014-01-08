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
var dao = require('./dao.js');
var _ = require('underscore');

exports.getRestaurants = function(req, res) {
    var id = req.params.id;

    if (id === undefined) {
        res.send({
            data: dao.getRestaurantList()
        });
    } else {
        res.send({
            data: dao.getRestaurant(1 * id)
        });
    }
};

exports.saveRestaurant = function(req, res) {
    var id = req.params.id;
    var restaurant = req.body;

    if (id === undefined) {
        res.send({
            data: dao.createRestaurant(restaurant)
        });
    } else {
        restaurant.id = 1 * id;
        res.send({
            data: dao.updateRestaurant(restaurant)
        });
    }
};

exports.deleteRestaurant = function(req, res) {
    var id = 1 * req.params.id;

    res.send({
        data: dao.deleteRestaurant(id)
    });
};

exports.getReservations = function(req, res) {
    var id = 1 * req.params.id;

    res.send({
        data: dao.getReservationList(id)
    });
}