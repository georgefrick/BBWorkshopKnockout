echo off

rem Install node dependencies locally
call npm install

rem Bootstrap the database if it doesn't exist
if not exist server/restaurants.db (
    call reset.bat
)

rem precompile handlebars templates
call node node_modules/handlebars/bin/handlebars webapp/template -f webapp/js/precompiled-templates.js

rem startup the node server
call node server/server --port 9000