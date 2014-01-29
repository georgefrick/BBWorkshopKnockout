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

(function () {
    "use strict";

    var RestaurantModule = {};
    window.RestaurantModule = RestaurantModule;

    /*
     * A basic POJSO to represent a Restaurant.
     * The two functions are examples of one way to do formatters in Knockout.
     */
    RestaurantModule.Restaurant = function(data) {
        var self = this;
        this.name = data.name;
        this.location = data.location;
        this.reservations = [];
        this.availableTimes = [];
        this.price = data.price;
        this.tagline = data.tagline || "";
        this.address = data.address;
        this.description = data.description;
        this.rating = data.rating;
        this.id = data.id;
        this.fPrice = function() {
            return FormatUtils.formatPrice(self.price);
        };
        this.fRating = function() {
            return FormatUtils.formatRating(self.rating);
        };
    };

    /*
     * The main application object, holds the top level references and the Sammy
     * router.
     */
    RestaurantModule.RestaurantView = function() {
        var self = this;
        self.restaurants = ko.observableArray([]);
        self.chosenRestaurant = ko.observable();
        self.chosenTime = ko.observable();
        self.availableTimes = ko.observableArray([]);
        self.reservations = ko.observableArray([]);
        Reservation.reservationForm.errors = ko.validation.group(Reservation.reservationForm);
        self.reservationForm = ko.validatedObservable(Reservation.reservationForm);
        self.confirmedReservation = ko.observable();
        self.ajaxWaiting = ko.observable(false);

        // A 'route' to choose a restaurant.
        self.goToRestaurant = function(restaurant) {
           location.hash = "restaurant/" + restaurant.id;
        };

        // An 'event' to select a time and show the form. Selecting the
        // time causes it to be non-null which the form visibility is bound to.
        self.goToForm = function(time) {
            self.chosenTime(time);
        };

        // The form submission event.
        self.submitForm = function(something) {

            if( self.reservationForm.isValid() ) {
                var data = ko.toJS(self.reservationForm); // toJSON returns a string.
                data.time = self.chosenTime();
                data.restaurantId = self.chosenRestaurant().id;
                self.ajaxWaiting(true);
                $.post("/reservations", data, function(response) {
                    console.log(response);
                    self.restaurants(null);
                    self.chosenRestaurant(null);
                    self.chosenTime(null);
                    self.availableTimes(null);
                    self.ajaxWaiting(false);
                    location.hash = "reservation/" + response.id;
                });
            } else {
                self.reservationForm.errors.showAllMessages();
            }

            return false; // KO will html submit if you return true.
        };

        // @TODO This is not implemented.
        self.cancelForm = function(something) {
            console.log("I got passed this: " + something);
        };

        /*
         * This is where the application 'starts up', by retrieving the restaurant list.
         */
        $.getJSON("/restaurants", function(allData) {
            var mappedRestaurants = $.map(allData, function(item) {
                return new RestaurantModule.Restaurant(item)
            });
            self.restaurants(mappedRestaurants);
        });

        /*
         * Start up the Sammy router.
         */
        $.sammy('body',function() {
            // When you go to root, reset the vars.
            this.get('/', function() {
                self.chosenRestaurant(null);
                self.chosenTime(null);
                self.availableTimes(null);
                self.reservations(null);
            });

            // Load a restaurant.
            this.get('#restaurant/:restaurantId', function() {

                $.getJSON("/restaurants/" + this.params.restaurantId, function(allData) {
                    self.chosenRestaurant(new RestaurantModule.Restaurant(allData));
                    console.log(allData.id);
                });
                $.getJSON('/restaurants/' + this.params.restaurantId + '/reservations', function(data) {
                    self.availableTimes(data.available);
                    self.reservations(data.reservations);
                });
                self.chosenTime(null);

            });

            // Load a reservation.
            this.get('#reservation/:reservationId', function() {

                $.getJSON("/reservations/" + this.params.reservationId, function(allData) {
                    var basicData = allData;
                    $.getJSON('/restaurants/' + basicData.restaurantId, function(data) {
                        basicData.restaurantName = data.name;
                        self.confirmedReservation(basicData);
                    });
                });

            });

        }).run();
    };

    return RestaurantModule;
})();
