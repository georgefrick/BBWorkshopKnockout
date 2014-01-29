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

/*
 *  A bit of a framework agnostic routing module. This module uses Sammy.js and Postal.js to
 *  publish routes as 'bus events'. This follows a discussion that the router shouldn't be the
 *  controller, but should be used to restore state/etc.
 */
(function(){
    "use strict";

    var Router = {};
    window.Router = Router;

    /*
     * Create constants for routes, to avoid using strings everywhere.
     */
    var routes = {
        MAIN : "main",
        RESTAURANT : "restaurant",
        RESERVATION : "reservation"
    };
    // 1. Get a reference to the default postal channel.
    var channel = postal.channel();

    Router.topic = "route.change";
    Router.routes = routes;

    /*
     * These routed represent application state, so it can be returned to or changed.
     */
    Router.router = Sammy('body',function() {

        // Load the root context (restaurant list)
        this.get('/', function() {
            channel.publish( Router.topic, {
                route : Router.routes.MAIN
            } );
        });

        // Load a restaurant.
        this.get('#restaurant/:restaurantId', function() {
            channel.publish( Router.topic, {
                route : Router.routes.RESTAURANT,
                id: this.params.restaurantId
            } );
        });

        // Load a reservation.
        this.get('#reservation/:reservationId', function() {
            channel.publish( Router.topic, {
                route: Router.routes.RESERVATION,
                id: this.params.reservationId
            });
        });

    });

})();
