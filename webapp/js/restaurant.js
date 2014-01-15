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

    RestaurantModule.Restaurant = Backbone.Model.extend({
        defaults: {
            name: "undefined",
            location: "",
            reservations: [],
            availableTimes: [],
            selected: false
        },
        urlRoot: "/restaurants",
        fetchReservations: function () {
            $.ajax('/restaurants/' + this.get('id') + '/reservations', {
                context: this,
                success: function (response) {
                    this.set({
                        'reservations': response.reservations,
                        'availableTimes': response.available
                    });
                    this.trigger('fetchComplete');
                },
                failure: function () {
                    console.log(['Something strange is afoot', arguments]);
                }
            });
        }
    });

    /**
     * View to Render a single Restaurant.
     * @type {*|void}
     */
    RestaurantModule.RestaurantView = Backbone.View.extend({
        defaults: {
            selected: false
        },
        events: {
            'click .availableTime': 'selectTime'
        },
        initialize: function () {
            this.template = Handlebars.templates.restaurant;
            this.listenTo(this.model, 'fetchComplete', this.render);
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            if (this.selected) {
                this.$el.find(".availableTimes").html(this.availableTimes.render().el);
            }
            return this;
        },
        showTimes: function () {
            this.selected = true;
            this.availableTimes = new RestaurantModule.TimeSlotView({model: this.model});
            this.model.fetchReservations();
        },
        selectTime: function (event) {
            var reservationTime = parseInt(event.currentTarget.getAttribute('value'));
            console.log("selected time: " + reservationTime);
        }
    });

    /**
     * Main View to Manage the Restaurant List for Reservations.
     * This view contains subviews in order to allow tighter control.
     * @type {*|void}
     */
    RestaurantModule.RestaurantListView = Backbone.View.extend({
        initialize: function () {
            this.template = Handlebars.templates.restaurantListView;
            this.restaurants = new RestaurantModule.RestaurantList();
            this.listenTo(this.restaurants, "add", this.addRestaurantView);

            _.bindAll(this, "fireReadyEvent");
            this.restaurants.fetch({
                success: this.fireReadyEvent
            });
        },
        render: function () {
            this.$el.html(this.template(this));
            return this;
        },
        addRestaurantView: function (restaurant) {
            var view = new RestaurantModule.RestaurantView({model: restaurant});
            this.$('.restaurantList').append(view.render().el);
        },
        count: function () {
            return this.restaurants.length;
        },
        fireReadyEvent: function () {
            this.trigger('ready');
        },
        getRestaurantById: function (id) {
            return this.restaurants.get(id);
        }
    });

    /**
     * Collection of Restaurant models.
     * @type {*|void}
     */
    RestaurantModule.RestaurantList = Backbone.Collection.extend({
        model: RestaurantModule.Restaurant,
        url: "/restaurants"
    });

    RestaurantModule.TimeSlotView = Backbone.View.extend({
        initialize: function (options) {
            this.template = Handlebars.templates.availableTimes;
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    })

    return RestaurantModule;
})();
