echo off
call npm install
call handlebars webapp/template/*.handlebars -f webapp/js/precompiled-templates.js
call node server/server --port 9000