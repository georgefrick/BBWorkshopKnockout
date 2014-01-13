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
 * Created by bpeterson on 1/9/14.
 */

(function () {
    "use strict";

    var RestaurantModule = {};
    window.RestaurantModule = RestaurantModule;

    /**
     * Model to define a Restaurant
     * @type {*|void}
     */
    RestaurantModule.Restaurant = Backbone.Model.extend({
        defaults: {
            name: "undefined",
            location: "",
            reservations: [],
            availableTimes: [],
            selected:false
        },
        urlRoot: "/restaurants",
        fetchReservations: function () {
            if (!this.has('id')) {
                return;
            }

            $.ajax('/restaurants/' + this.get('id') + '/reservations', {
                context: this,
                success: function (response) {
                    this.set('reservations', response.reservations);
                    this.set('availableTimes', response.available);
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
        events: {
            'click .restaurantRow': 'selectRestaurant'
        },
        initialize: function () {
            this.template = Handlebars.templates.restaurant;
            this.model.on('change',this.render,this);
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        selectRestaurant: function () {
            console.log("Selected " + this.model.get('name'));
            this.model.fetchReservations();
            this.trigger("selectRestaurant", this.model);
        }
    });

    /**
     * Main View to Manage the Restaurant List for Reservations.
     * This view contains subviews in order to allow tighter control.
     * @type {*|void}
     */
    RestaurantModule.RestaurantManagerView = Backbone.View.extend({
        initialize: function () {
            this.template = Handlebars.templates.restaurantManager;
            this.restaurants = new RestaurantModule.RestaurantList();
            this.restaurants.on("add", this.render, this);
            this.restaurants.fetch();
            _.bindAll(this, "showSelectedRestaurant");
        },
        render: function () {
            this.$el.html(this.template(this));
            this.restaurants.each(this.addRestaurantView, this);
            return this;
        },
        addRestaurantView: function (restaurant) {
            var view = new RestaurantModule.RestaurantView({model: restaurant});
            view.on('selectRestaurant', this.showSelectedRestaurant);
            this.$('.restaurantList').append(view.render().el);
        },
        showSelectedRestaurant: function (model) {
            console.log("Selected Restaurant");
            this.restaurants.each(function (restaurant) {
                if (model===restaurant){
                    restaurant.set(selected, true);
                }else {
                    restaurant.set(selected, false);
                }

            });

//            var selectedRestaurantView = new RestaurantModule.SelectedRestaurantView({model: model});
//            this.$el.find('.selectedRestaurant').html(selectedRestaurantView.render().el);
        },
        count: function () {
            return this.restaurants.length;
        }

    });


    RestaurantModule.SelectedRestaurantView = Backbone.View.extend({
        initialize: function () {
            this.template = Handlebars.templates.selectedRestaurant;
        },
        render: function () {
            this.$el.empty();
            this.$el.append(this.template(this.model.toJSON()));
            return this;
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

    /**
     * @TODO Evaluate how we want to present the list. This uses an {{#each}} construct to have a single view.
     * This View holds onto a list of Restaurant objects and is a single view.
     * @type {*|void}
     */
    RestaurantModule.RestaurantListView = Backbone.View.extend({
        initialize: function () {
            this.template = Handlebars.templates.restaurantList;
            this.restaurants = new RestaurantModule.RestaurantList();
            this.restaurants.on("all", this.render, this);
            this.restaurants.fetch();
        },
        render: function () {
            this.$el.html(this.template({count: this.count(), restaurant: this.restaurants.toJSON()}));
            return this;
        },
        count: function () {
            return this.restaurants.length;
        }
    });

    return RestaurantModule;
})();
