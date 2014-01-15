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
(function() {
    "use strict";

    module("Web Server Module");

    var reset = function() {
        return $.ajax('/reset', { async: false }).responseJSON;
    };

    var getRestaurantList = function() {
        return $.ajax('/restaurants', { async: false }).responseJSON;
    };

    var getRestaurant = function(id) {
        return $.ajax('/restaurants/' + id, { async: false }).responseJSON;
    };

    var saveRestaurant = function(method, json) {
        var url = "/restaurants";
        if (json.id !== undefined) {
            url += "/" + json.id;
        }
        return $.ajax({
            async: false,
            url: url,
            type: method,
            data: json
        });
    };

    var buildRestaurantJSON = function(id) {
        return {
            id: id,
            name: "Kurger Bing",
            cuisine: "Food",
            tagline: "We cook food!",
            description: "We are the coolest!",
            rating: 27,
            price: 1
        };
    };
    
    test("GET /restaurants", function() {
        expect(1);
        reset();

        var restaurants = getRestaurantList();

        ok(restaurants.length === 10, "Restaurants returned");
    });

    test("GET /restaurants/:id", function() {
        expect(1);
        reset();

        var restaurants = getRestaurantList();

        var id = restaurants[0].id;
        var name = restaurants[0].name;

        var restaurant = getRestaurant(id);
        ok(restaurant.id === id && restaurant.name === name, "Restaurant returned");
    });

    // test("PUT /restaurants", function() {
    //     expect(3);
    //     reset();

    //     var json = buildRestaurantJSON();
    //     var restaurant = saveRestaurant("PUT", json);

    //     ok(json.name === restaurant.name, "Restaurant is saved");
    //     ok(getRestaurantList().length === 11, "Restaurant is saved");
    //     ok(getRestaurant(restaurant.id).name === restaurant.name, "Restaurant is saved");
    // });

    // test("PUT /restaurants/:id", function() {

    // });

    // test("POST /restaurants", function() {

    // });

    // test("POST /restaurants/:id", function() {

    // });
})();

// var restaurantServiceRoutes = {
//     'get': {
//         '/restaurants/:id/reservations': restaurantService.getReservations
//     },
//     'delete': {
//         '/restaurants/:id': restaurantService.deleteRestaurant
//     }
// };
// var reservationServiceRoutes = {
//     'get': {
//         '/reservations/:id': reservationService.getReservations
//     },
//     'put': {
//         '/reservations': reservationService.saveReservation,
//         '/reservations/:id': reservationService.saveReservation
//     },
//     'post': {
//         '/reservations': reservationService.saveReservation,
//         '/reservations/:id': reservationService.saveReservation
//     },
//     'delete': {
//         '/reservations/:id': reservationService.deleteReservation
//     }
// };

