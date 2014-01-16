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

(function(){
    "use strict";

    $(document).ready(function(){
        var allRestaurantView = new RestaurantModule.RestaurantListView();

        var allRestaurantContent = $("#restaurant-list-main");
        var singleRestaurantContent = $("#selected-restaurant-main");
        var reservationResultContent = $("#show-reservation-main");

        allRestaurantContent.empty();
        allRestaurantContent.append(allRestaurantView.render().el);

        new (Backbone.Router.extend({
            routes: {
                "":"showRestaurants",
                "restaurant/:id": "selectRestaurant",
                "reservation/:id":"showReservationResult"
            },

            showRestaurants :function() {
                allRestaurantContent.show();
                singleRestaurantContent.hide();
                reservationResultContent.hide();
            },
            selectRestaurant: function(id) {
                var selected = allRestaurantView.getRestaurantById(id);
                var singleRestaurantView = new RestaurantModule.RestaurantView({model:selected});
                singleRestaurantContent.empty().append(singleRestaurantView.el);
                singleRestaurantView.showTimes();

                allRestaurantContent.hide();
                reservationResultContent.hide();
                singleRestaurantContent.show();
            },
            showReservationResult:function(id){
                var reservationView = new Reservation.View();
                reservationResultContent.empty().append(reservationView.el);
                reservationView.fetchReservation(id);

                allRestaurantContent.hide();
                singleRestaurantContent.hide();
                reservationResultContent.show();
            }
        }))();

        allRestaurantView.on('ready', function() {
            Backbone.history.start();
        });
    });


})();
