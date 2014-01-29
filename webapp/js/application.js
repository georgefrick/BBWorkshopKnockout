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

(function(){
    "use strict";

    $(document).ready(function(){

        /*
         * Build a router, we can now do this first.
         */
        var router = Router.router;

        // Before starting up Knockout, configure the validator plugin.
        ko.validation.rules.pattern.message = 'Invalid.';

        ko.validation.configure({
            registerExtenders: true,
            messagesOnModified: true,
            insertMessages: false,
            parseInputAttributes: true,
            messageTemplate: null,
            decorateInputElement: true,
            decorateElement: true,
            errorElementClass: 'invalid'
        });

        /*
         * http://digitalbush.com/2013/12/11/knockout-js-href-binding/
         * Example of creating a custom binding.
         */
        ko.bindingHandlers.href = {
            update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
                var path = valueAccessor();
                var replaced = path.replace(/:([A-Za-z_]+)/g, function(_, token) {
                    return ko.unwrap(viewModel[token]);
                });
                element.href = replaced;
            }
        };

        /*
         * Create a top level View class.
         */
        var View = function(title, templateName, data) {
            this.title = title;
            this.templateName = templateName;
            this.data = data;
        };

        /*
         * Create the top level View, containing our view classes.
         */
        var viewModel = {
            views: ko.observableArray([
                new View("RestaurantList",  "restaurant-list-template",   new RestaurantModule.RestaurantListView()),
                new View("RestaurantView",  "restaurant-single-template", new RestaurantModule.RestaurantSingleView()),
                new View("ReservationView", "reservation-template", new ReservationModule.ReservationView())
            ]),
            selectedView: ko.observable()
        };

        /*
         * Build a small controller to change our view as requested.
         */
        var controller = (function() {
            var channel = postal.channel();
            var subscription = channel.subscribe( Router.topic, function ( data ) {
                console.log("!!!");
                if( data.route === Router.routes.MAIN ) {
                    viewModel.selectedView(viewModel.views()[0]);
                } else if( data.route === Router.routes.RESTAURANT ) {
                    viewModel.selectedView(viewModel.views()[1]);
                } else if ( data.route === Router.routes.RESERVATION) {
                    viewModel.selectedView(viewModel.views()[2]);
                }
            } );
        })();

        // Start up knockout by binding the main object.
        ko.applyBindings(viewModel);

        // Finish by starting the router.
        router.run();
    });

})();
