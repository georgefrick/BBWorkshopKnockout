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

var _ = require("underscore");

var reservations = [];

var restaurants = [{
    id: 1,
    name: "Bartolotta's Lake Park Bistro",
    cuisine: "French",
    address: "3133 E Newberry Blvd",
    tagline: "At the Bartolotta restaurants we like to think that every meal we serve is special.",
    description: "Bartolotta's Lake Park Bistro is one of the premiere brasserie-style French restaurants in Wisconsin. With a location in Milwaukee, it provides an ideal setting for hosting social occasions, corporate group events, weddings and parties.",
    rating: 83,
    price: 4
}, {
    id: 2,
    name: "Sanford",
    cuisine: "American",
    address: "1547 N Jackson St",
    description: "It is the philosophy of Sanford Restaurant to start with the finest possible ingredients, coming from as close to home as possible, supporting local farms and artisans whenever possible. We then treat those ingredients with the utmost respect, coaxing and elevating the natural flavor to the highest possible level.",
    rating: 88,
    price: 4
}, {
    id: 3,
    name: "Eddie Martini's",
    cuisine: "Steakhouse",
    address: "8612 W Watertown Plank Rd",
    tagline: "Our main goal: complete guest satisfaction.",
    description: "Eddie Martini's is a 1940's style fine dining restaurant, featuring the freshest in steaks, chops and seafood. Our main goal: complete guest satisfaction.  We will accomplish this by offering service above and beyond our guests' expectations, preparing and serving food and beverages of high, consistent quality and creating an atmosphere that satisfies the wants and needs of our guests in ambiance and decor.",
    rating: 83,
    price: 4
}, {
    id: 4,
    name: "Hinterland Erie Street Gastropub",
    cuisine: "Gastropub",
    address: "222 E Erie St",
    tagline: "Hinterland... a new hub for contemporary American cuisine in Milwaukee, Wisconsin.",
    description: "Executive Chef Dan Van Rite and Sous Chef Paul Funk, explore a multicultural approach to cooking and eating. Their journey to create bold flavors and uncommon pairings is a daily mission at Hinterland.",
    rating: 86,
    price: 4
}, {
    id: 5,
    name: "Kil@Wat",
    cuisine: "Asian",
    address: "139 E Kilbourn Ave",
    tagline: "Kil@wat's electrifying cuisine and atmosphere is truly a centerpiece of fine Downtown Milwaukee dining.",
    description: "Kil@wat combines an inventive interpretation of contemporary American cuisine, an elegant yet comfortable setting, and inspiring views of downtown Milwaukee to create a thoroughly enjoyable dining experience.  With a prime location just steps from the theater district and other attractions, Kil@wat makes an ideal starting point, resting spot, or final destination for anyone on a downtown adventure.",
    rating: 86,
    price: 4
}, {
    id: 6,
    name: "Zarletti",
    cuisine: "Italian",
    address: "741 N Milwaukee St",
    tagline: "Milwaukee's premier modern italian restaurant.",
    description: "Zarletti serves traditional Italian classics in a casual contemporary atmosphere. Opening in 2004 we have been rated by Milwaukee critic Dennis Getto as \"some of the best Italian food being served in Milwaukee these days.\"",
    rating: 89,
    price: 4
}, {
    id: 7,
    name: "Mader's",
    cuisine: "German",
    address: "1041 N Old World 3rd St",
    tagline: "We've been preparing for your visit since 1902.",
    description: "Over the past 106 years Mader's restaurant has meant many things to many people. From the days of 3 cent beers and .20 cent dinners, through its days of politicians trading confidences over lunch to its many incarnations as a gathering place for citizens from all over the world, Mader's German cuisine restaurant has been a place like no other. More than any other institution Mader's means to persons from every background a backdrop for their most cherished celebrations. Young brides excitedly discuss their wedding plans. The famous and powerful eagerly anticipate their events.",
    rating: 75,
    price: 4
}, {
    id: 8,
    name: "Shogun",
    cuisine: "Sushi",
    address: "518 College Ave",
    description: "Japanese Teppanyaki Steakhouse & Sushi",
    rating: 81,
    price: 4
}, {
    id: 9,
    name: "Harbor House",
    cuisine: "Seafood",
    address: "550 Harbor Dr",
    tagline: "Harbor House Serves Great Seafood with a View.",
    description: "Seafood - Steaks - Raw Bar - Cocktails",
    rating: 78,
    price: 4
}, {
    id: 10,
    name: "Carson's Ribs",
    cuisine: "Barbecue",
    address: "1141 N Old World 3rd St",
    tagline: "America's #1 BBQ",
    description: "A Chicago institution since 1977, Carson's is the place visited by presidents, America's favorite athletes, stars of TV, the big screen, and literally millions of BBQ devotees. With hearty portions and a no holds barred attitude of offering only the finest quality available, Carson's promises to be a fabulous dining experience. For those seeking the best in an undeniably American dining tradition, Carson’s is a must!",
    rating: 85,
    price: 3
}];

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

var restaurantId = 11;
var reservationId = 1;
var getNextRestaurantId = function() {
    return restaurantId++;
};
var getNextReservationId = function() {
    return reservationId++;
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
        id: getNextRestaurantId(),
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
    var available = _.difference(validReservationTimes, _.pluck(filtered, "time"));
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
        id: getNextReservationId(),
        restaurantId: 1 * json.restaurantId,
        name: json.name,
        phone: json.phone,
        guests: json.guests,
        time: 1 * json.time,
        created: new Date().getTime()
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
    reservation.time = 1 * json.time;

    return reservation;
};

exports.deleteReservation = function(id) {
    var reservation = exports.getReservation(id);
    reservations = _.without(reservations, reservation);

    return "Reservation " + id + " deleted";
}