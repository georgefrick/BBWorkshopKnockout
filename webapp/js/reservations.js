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

    var ReservationModule = {};
    window.ReservationModule = ReservationModule;

    ko.validation.rules['phone'] = {
        validator: function (value) {

            if (value !== undefined) {
                var check = value.replace(/[\s\(\)]/g, '');
                if (check.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)) {
                    return true;
                }
                return false;
            }
        },
        message: "Must be a valid phone number."
    };
    ko.validation.registerExtenders();

    /*
     * A Knockout observable structure to represent the form and have
     * two way data binding.
     * Additionally, validation is now also specified.
     */
    ReservationModule.reservationForm = {
        guests : ko.observable(2).extend({  required: true }),
        name : ko.observable().extend({ required: true, minLength: 2 }),
        phone : ko.observable().extend({  required: true,
            phone: true}),
        email : ko.observable(),
        location : ko.observable(),
        isSpecialOccasion : ko.observable(),
        specialRequests : ko.observable()
    };

    /*
     * A simple view for viewing an existing reservation object.
     */
    ReservationModule.ReservationView = function() {
        var self = this;
        self.confirmedReservation = ko.observable();

        var channel = postal.channel();
        var subscription = channel.subscribe( Router.topic, function ( data ) {
            if ( data.route === Router.routes.RESERVATION) {
                self.showReservation(data.id);
            }
        } );

        self.showReservation = function(id) {
            $.getJSON("/reservations/" + id, function(allData) {
                var basicData = allData;
                $.getJSON('/restaurants/' + basicData.restaurantId, function(data) {
                    basicData.restaurantName = data.name;
                    self.confirmedReservation(basicData);
                });
            });
        };

    };

})();