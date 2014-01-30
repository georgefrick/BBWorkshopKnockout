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

(function() {
    "use strict";
    // Before starting up Knockout, configure the validator plugin.
    ko.validation.rules.pattern.message = 'Invalid.';

    ko.validation.configure({
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: false,
        parseInputAttributes: true,
        messageTemplate: null,
        decorateInputElement: false,
        decorateElement: false,
        errorElementClass: 'invalid'
    });

    ReservationModule.reservationForm.errors = ko.validation.group(ReservationModule.reservationForm);
    var tester = {
      reservationForm : ReservationModule.reservationForm
    };

    describe("A reservation form ", function() {
        it("validates # of guests.", function() {
            expect(tester.reservationForm.guests.isValid()).toBe(true); // defaults to 2.
            tester.reservationForm.guests(null);
            expect(tester.reservationForm.guests.isValid()).toBe(false);
            tester.reservationForm.guests("2");
            expect(tester.reservationForm.guests.isValid()).toBe(true);

        });
        it("validates name.", function() {
            expect(tester.reservationForm.name.isValid()).toBe(false);
            tester.reservationForm.name("John Doe");
            expect(tester.reservationForm.name.isValid()).toBe(true);
        });
        it("validates phone.", function() {
            expect(tester.reservationForm.phone.isValid()).toBe(false);
            tester.reservationForm.phone("414-abcd");
            expect(tester.reservationForm.phone.isValid()).toBe(false);
            tester.reservationForm.phone("(414)555-5309");
            expect(tester.reservationForm.phone.isValid()).toBe(true);
        });
        it("is fully validated.", function(){
            expect(tester.reservationForm.isValid()).toBe(true);
        });
    });

})();