#!/bin/bash

# install node dependencies
sudo npm install

# bootstrap the database if it doesn't exist
[ ! -f server/restaurants.db ] && ./reset.sh

# precompile the handlebars templates
./node_modules/handlebars/bin/handlebars webapp/template/*.handlebars -f webapp/js/precompiled-templates.js

# startup the node server
node server/server --port 9000