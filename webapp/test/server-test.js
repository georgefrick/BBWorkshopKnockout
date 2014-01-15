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

    module("Restaurant Service Module");

    var reset = function() {
        return $.ajax('/reset', { async: false }).responseJSON;
    };

    var getRestaurantList = function() {
        return $.ajax('/restaurants', { async: false }).responseJSON;
    };

    var getReservationList = function(id) {
        return $.ajax('/restaurants/' + id + '/reservations', { async: false }).responseJSON;
    };

    var getRestaurant = function(id) {
        return $.ajax('/restaurants/' + id, { async: false }).responseJSON;
    };

    var getReservation = function(id) {
        return $.ajax('/reservations/' + id, { async: false }).responseJSON;
    }

    var deleteRestaurant = function(id) {
        $.ajax('restaurants/' + id, { async: false, type: "DELETE" });
    }

    var deleteReservation = function(id) {
        $.ajax('reservations/' + id, { async: false, type: "DELETE" });
    }

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
        }).responseJSON;
    };

    var saveReservation = function(method, json) {
        var url = "/reservations";
        if (json.id !== undefined) {
            url += "/" + json.id;
        }
        return $.ajax({
            async: false,
            url: url,
            type: method,
            data: json
        }).responseJSON;
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

    var buildReservationJSON = function(restaurantId, id) {
        return {
            id: id,
            restaurantId: restaurantId,
            name: "John Doe",
            phone: "1-800-123-1234",
            guests: 5,
            time: validReservationTimes[0]
        };
    };

    // "Borrowed" this from the server :-)
    var validReservationTimes = (function() {
        var arr = [];
        var start = new Date();
        start.setHours(16);
        start.setMinutes(0);
        start.setSeconds(0);
        start.setMilliseconds(0);

        var stop = new Date(start.getTime());
        stop.setHours(22);

        while (start.getTime() <= stop.getTime()) {
            arr.push(start.getTime());
            // add 30 minutes
            start = new Date(start.getTime() + (1000 * 60 * 30));
        }

        return arr;
    })();
    
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

    test("PUT /restaurants", function() {
        expect(3);
        reset();

        var json = buildRestaurantJSON();
        var restaurant = saveRestaurant("PUT", json);

        ok(json.name === restaurant.name, "Restaurant is saved");
        ok(getRestaurantList().length === 11, "Restaurant is saved");
        ok(getRestaurant(restaurant.id).name === restaurant.name, "Restaurant is saved");
    });

    test("PUT /restaurants/:id", function() {
        expect(2);
        reset();

        var restaurants = getRestaurantList();

        restaurants[0].name = 'Malodorous Malcontents';

        var restaurant = saveRestaurant("PUT", restaurants[0]);

        ok(restaurant.name === restaurants[0].name, "Restaurant is saved");
        ok(getRestaurant(restaurant.id).name === restaurants[0].name, "Restaurant is saved");
    });

    test("POST /restaurants", function() {
        expect(3);
        reset();

        var json = buildRestaurantJSON();
        var restaurant = saveRestaurant("POST", json);

        ok(json.name === restaurant.name, "Restaurant is saved");
        ok(getRestaurantList().length === 11, "Restaurant is saved");
        ok(getRestaurant(restaurant.id).name === restaurant.name, "Restaurant is saved");
    });

    test("POST /restaurants/:id", function() {
        expect(2);
        reset();

        var restaurants = getRestaurantList();

        restaurants[0].name = 'Malodorous Malcontents';

        var restaurant = saveRestaurant("POST", restaurants[0]);

        ok(restaurant.name === restaurants[0].name, "Restaurant is saved");
        ok(getRestaurant(restaurant.id).name === restaurants[0].name, "Restaurant is saved");
    });

    test("DELETE /restaurants/:id", function() {
        expect(1);
        reset();

        deleteRestaurant(getRestaurantList()[0].id);

        ok(getRestaurantList().length === 9, "Restaurant deleted");
    });

    test("GET /restaurants/:id/reservations", function() {
        expect(3);
        reset();

        var restaurant = getRestaurantList()[0];

        var json = buildReservationJSON(restaurant.id);
        var reservation = saveReservation("POST", json);

        var reservations = getReservationList(restaurant.id);

        ok(reservations.reservations.length === 1, "Reservation list returned");
        ok(reservations.reservations[0].name === json.name, "Reservation list returned");

        ok(_.indexOf(reservations.available, reservations.reservations[0].time) === -1, "Available times updated");
    });

    module("Reservation Service Module");

    test("GET /reservations/:id", function() {
        expect(1);
        reset();

        var restaurant = getRestaurantList()[0];

        var json = buildReservationJSON(restaurant.id);
        var result = saveReservation("PUT", json);

        var reservation = getReservation(result.id);

        ok(reservation, "Reservation returned");
    });

    test("PUT /reservations", function() {
        expect(2);
        reset();

        var restaurant = getRestaurantList()[0];

        var json = buildReservationJSON(restaurant.id);
        var reservation = saveReservation("PUT", json);

        ok(reservation, "Reservation saved");
        ok(reservation.name === json.name, "Reservation Saved");
    });

    test("PUT /reservations/:id", function() {
        expect(2);
        reset();

        var restaurant = getRestaurantList()[0];

        var json = buildReservationJSON(restaurant.id);
        var reservation = saveReservation("PUT", json);

        reservation.name = "Genghis Khan";
        reservation = saveReservation("PUT", reservation);

        ok(reservation, "Reservation saved");
        ok(reservation.name === "Genghis Khan", "Reservation Saved");
    });

    test("POST /reservations", function() {
        expect(2);
        reset();

        var restaurant = getRestaurantList()[0];

        var json = buildReservationJSON(restaurant.id);
        var reservation = saveReservation("POST", json);

        ok(reservation, "Reservation saved");
        ok(reservation.name === json.name, "Reservation Saved");
    });

    test("POST /reservations/:id", function() {
        expect(2);
        reset();

        var restaurant = getRestaurantList()[0];

        var json = buildReservationJSON(restaurant.id);
        var reservation = saveReservation("POST", json);

        reservation.name = "Genghis Khan";
        reservation = saveReservation("POST", reservation);

        ok(reservation, "Reservation saved");
        ok(reservation.name === "Genghis Khan", "Reservation Saved");
    });

    test("DELETE /reservations/:id", function() {
        expect(2);
        reset();

        var restaurant = getRestaurantList()[0];

        var json = buildReservationJSON(restaurant.id);
        var reservation = saveReservation("POST", json);

        ok(getReservation(reservation.id), "Reservation saved");

        deleteReservation(reservation.id);

        ok(!getReservation(reservation.id), "Reservation deleted");
    });
})();