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
 * jgitter 1-10-2014
 */
(function() {
    "use strict";

    var Reservation = {};
    window.Reservation = Reservation;

    Reservation.Model = Backbone.Model.extend({
        urlRoot: "/reservations",
        url:"/reservations",
        validation: {
            name: {
                required: true,
                minLength: 2,
                msg: "Please enter a valid first name"
            },
            phone: {
                required: true,
                fn: function(value) {
                    var check = value.replace(/[\s\(\)]/g, '');
                    if (check.match(/1?-?(\d{3})?-?\d{3}-?\d{4}/) === null) {
                        return "Please enter a valid phone number"
                    }
                }
            },
            guests: {
                required: true,
                pattern: 'digits',
                range: [1, 10]
            },
            time: {
                required: true
            }
        }
    });

    Reservation.FormView = Backbone.View.extend({
        events: {
            'change input[type="text"]': 'changeGenericValue',
            'change select': 'changeGenericValue',
            "keypress input[type='text']": 'actOnEnter',
            'click .submitButton':'submitReservationRequest',
            'click .cancelButton' : 'cancelReservationRequest'
        },
        initialize: function(options) {
            this.template = Handlebars.templates.reservationForm;
            this.model = new Reservation.Model({
                restaurantId: options.restaurantId,
                reservationTime:options.reservationTime
            });

            this.model.get('restaurant');

//            Backbone.Validation.bind(this);
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        changeGenericValue : function(event){
            var sValue = $(event.currentTarget).val();
            var sName = $(event.currentTarget).attr("name");

            // This creates a data binding to the model based on the attributes name/value pair.
            var temp = {};
            temp[sName] = sValue;

            // Update the model but don't cause any change event.
            this.model.set(temp,{silent:true});
        },
        actOnEnter: function(event){
            if (event.keyCode != 13){
                return;
            }

            // Prevent default enter behavior.
            event.preventDefault();

            // Make the update to the value as a result of the Enter.
            this.changeGenericValue(event);
            return false;
        },
        submitReservationRequest: function () {
//            var validationResults = this.model.validate();
//            if (this.model.isValid()) {
//              this.model.save(this.model, {
//                    success: function() {
//                        console.log("Saved Reservations");
//                    },
//                    error: function () {
//                        console.log("Failed to save()");
//                    }
//              });
            this.model.save(this.model,{wait:true});
            return false;
        },
        cancelReservationRequest: function(){
            this.remove();
            return false;
        }
    });

    Reservation.View = Backbone.View.extend({
        initialize: function() {
            this.template = Handlebars.templates.reservation;
            this.model = new Reservation.Model();
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
})();