echo off
call npm install
call ./node_modules/handlebars/bin/handlebars webapp/template/*.handlebars -f webapp/js/precompiled-templates.js
call node server/server --port 9000