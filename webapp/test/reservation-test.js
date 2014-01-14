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

    module("Reservation Module");

    var getReservation = function() {
        return new Reservation.Model({
            id: 'abc123',
            restaurantId: 'zyx987',
            name: 'Jerry Rice',
            phone: '1-800-123-4567',
            guests: 1,
            time: new Date().getTime()
        });
    };

    test("reservation-validation", function() {
        expect(15);

        var reservation = getReservation();
        ok(reservation.isValid(true), "Check valid model");

        reservation = getReservation();
        reservation.set('name', 'A');
        ok(reservation.isValid(true) === false, "Name is too short");

        reservation = getReservation();
        reservation.set('guests', 0);
        ok(reservation.isValid(true) === false, "Guests must be greater than or equal to 1");

        reservation.set('guests', 1);
        ok(reservation.isValid(true), "Guests must be greater than or equal to 1");

        reservation.set('guests', 10);
        ok(reservation.isValid(true), "Guests must be less than or equal to 10");

        reservation.set('guests', 11);
        ok(reservation.isValid(true) === false, "Guests must be less than or equal to 10");

        reservation = getReservation();
        reservation.unset('time');
        ok(reservation.isValid(true) === false, "Time is required");

        reservation = getReservation();
        reservation.set('phone', '123-123-1234');
        ok(reservation.isValid(true), "Check valid phone number formats");

        reservation.set('phone', '123-1234');
        ok(reservation.isValid(true), "Check valid phone number formats");

        reservation.set('phone', '(123) 123-1234');
        ok(reservation.isValid(true), "Check valid phone number formats");

        reservation.set('phone', '1 2 3 - 1 2 3 - 1 2 3 4');
        ok(reservation.isValid(true), "Check valid phone number formats");

        reservation.set('phone', '12-31234');
        ok(reservation.isValid(true) === false, "Check invalid phone number formats");

        reservation.set('phone', '123-123-234');
        ok(reservation.isValid(true) === false, "Check invalid phone number formats");

        reservation.set('phone', '2-123-123-1234');
        ok(reservation.isValid(true) === false, "Check invalid phone number formats");

        reservation.set('phone', '123-12-1234');
        ok(reservation.isValid(true) === false, "Check invalid phone number formats");
    });
})();