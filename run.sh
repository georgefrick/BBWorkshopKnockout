#!/bin/bash
sudo npm install
./node_modules/handlebars/bin/handlebars webapp/template/*.handlebars -f webapp/js/precompiled-templates.js
node server/server --port 9000