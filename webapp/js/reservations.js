window.Reservation = (function() {
    var reservation = Backbone.Model.extend({
        // validation: {
        //     name: {
        //         required: true,
        //         minLength: 2,
        //         msg: "Please enter a valid first name"
        //     },
        //     phone: {
        //         required: true,
        //         fn: function(value) {
        //             var check = value.replace(/[\s\(\)]/g, '');
        //             if (check.match(/1?-?(\d{3})?-?\d{3}-?\d{4}/) === null) {
        //                 return "Please enter a valid phone number [1] [-] [XXX] [-] XXX [-] XXXX"
        //             }
        //         }
        //     },
        //     guests: {
        //         required: true,
        //         pattern: 'digits',
        //         range: [1, 10]
        //     },
        //     time: {
        //         require: true,
        //         oneOf: ['4:00 pm', '4:30 pm',
        //                 '5:00 pm', '5:30 pm',
        //                 '6:00 pm', '6:30 pm',
        //                 '7:00 pm', '7:30 pm',
        //                 '8:00 pm', '8:30 pm',
        //                 '9:00 pm', '9:30 pm',
        //                 '10:00 pm']
        //     }
        // }
    });

    var formView = Backbone.View.extend({
        initialize: function() {
            this.tpl = Handlebars.templates.reservationForm;
            this.model = new Backbone.Model({
                reservation: {},
                restaurant: this.options.restaurant.toJSON()
            });

            // Backbone.Validation.bind(this);
        },
        render: function() {
            this.$el.html(this.tpl());
            return this;
        }
    });

    var view = Backbone.View.extend({
        initialize: function() {
            this.tpl = Handlebars.templates.reservation;
            this.model = new reservation({
                name: 'Jerry Rice',
                phone: '1-800-123-4567',
                guests: 3,
                time: '5:30 pm'
            });
        },
        render: function() {
            this.$el.html(this.tpl(this.model.toJSON()));
            return this;
        }
    });

    return {
        Model: reservation,
        View: view,
        FormView: formView
    };
})();