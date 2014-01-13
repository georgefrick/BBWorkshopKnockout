(function() {
    "use strict";

    Handlebars.registerHelper('showPrice', function(price) {
        var index, out = "";
        for (index = 1; index <= price; index++) {
            out += "$";
        }

        return out;
    });

    Handlebars.registerHelper('showRating', function(rating) {
        var index, out = "";
        for (index = 1; index <= Math.round(rating / 20); index++) {
            out += "*";
        }

        return out;
    });
})();
