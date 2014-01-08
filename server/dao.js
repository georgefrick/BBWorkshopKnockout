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
var _ = require("underscore");

var reservations = [];

var availableReservations = ['4:00 pm', '4:30 pm',
                             '5:00 pm', '5:30 pm',
                             '6:00 pm', '6:30 pm',
                             '7:00 pm', '7:30 pm',
                             '8:00 pm', '8:30 pm',
                             '9:00 pm', '9:30 pm',
                             '10:00 pm'];

var restaurants = [{
    id: 1,
    name: "Bartolotta's Lake Park Bistro",
    cuisine: "French",
    address: "3133 E Newberry Blvd"
}, {
    id: 2,
    name: "Sanford",
    cuisine: "American",
    address: "1547 N Jackson St"
}, {
    id: 3,
    name: "Eddie Martini's",
    cuisine: "Steakhouse",
    address: "8612 W Watertown Plank Rd"
}, {
    id: 4,
    name: "Hinterland Erie Street Gastropub",
    cuisine: "Gastropub",
    address: "222 E Erie St"
}, {
    id: 5,
    name: "Kil@Wat",
    cuisine: "Asian",
    address: "139 E Kilbourn Ave"
}, {
    id: 6,
    name: "Zarletti",
    cuisine: "Italian",
    address: "741 N Milwaukee St"
}, {
    id: 7,
    name: "Mader's",
    cuisine: "German",
    address: "1041 N Old World 3rd St"
}, {
    id: 8,
    name: "Shogun",
    cuisine: "Sushi",
    address: "518 College Ave"
}, {
    id: 9,
    name: "Harbor House",
    cuisine: "Seafood",
    address: "550 Harbor Dr"
}, {
    id: 10,
    name: "Carson's Ribs",
    cuisine: "Barbecue",
    address: "1141 N Old World 3rd St"
}];

var id = 11;
var getNextId = function() {
    return id++;
};

exports.getRestaurantList = function() {
    return restaurants;
};

exports.getRestaurant = function(id) {
    return _.find(restaurants, function(restaurant) {
        return restaurant.id === id;
    });
};

exports.createRestaurant = function(json) {
    var restaurant = {
        id: getNextId(),
        name: json.name,
        cuisine: json.cuisine,
        address: json.address
    };
    restaurants.push(restaurant);
    return restaurant;
}

exports.updateRestaurant = function(json) {
    var restaurant = exports.getRestaurant(json.id);

    if (json.name !== undefined) {
        restaurant.name = json.name;
    }
    if (json.cuisine !== undefined) {
        restaurant.cuisine = json.cuisine;
    }
    if (json.address !== undefined) {
        restaurant.address = json.address;
    }

    return restaurant;
};

exports.deleteRestaurant = function(id) {
    var restaurant = exports.getRestaurant(id);
    restaurants = _.without(restaurants, restaurant);
    
    return "Restaurant " + id + " deleted";
}

exports.getReservationList = function(id) {
    var filtered = _.filter(reservations, function(reservation) {
        return reservation.restaurantId === id;
    });
    var available = _.difference(availableReservations, _.pluck(filtered, "time"));
    return {
        reservations: filtered,
        available: available
    }
};

exports.getReservation = function(id) {
    return _.find(reservations, function(reservation) {
        return reservation.id === id;
    });
};

exports.createReservation = function(json) {
    var reservation = {
        id: getNextId(),
        restaurantId: 1 * json.restaurantId,
        name: json.name,
        phone: json.phone,
        guests: json.guests,
        time: json.time
    };
    reservations.push(reservation);
    return reservation;
}

exports.updateReservation = function(json) {
    var reservation = exports.getReservation(json.id);

    if (json.restaurantId !== undefined) {
        reservation.restaurantId = 1 * json.restaurantId
    }
    if (json.name !== undefined) {
        reservation.name = json.name;
    }
    if (json.phone !== undefined) {
        reservation.phone = json.phone;
    }
    if (json.guests !== undefined) {
        reservation.guests = json.guests;
    }
    reservation.time = json.time;

    return reservation;
};

exports.deleteReservation = function(id) {
    var reservation = exports.getReservation(id);
    reservations = _.without(reservations, reservation);

    return "Reservation " + id + " deleted";
}