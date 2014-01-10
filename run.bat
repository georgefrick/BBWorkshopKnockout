echo off
call npm install
call node node_modules/handlebars/bin/handlebars webapp/template -f webapp/js/precompiled-templates.js                                                     
call node server/server --port 9000