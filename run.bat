echo off
call npm install
rem This was changed to call node directly, as the bin file isn't a windows executable.
call node node_modules/handlebars/bin/handlebars webapp/template -f webapp/js/precompiled-templates.js
call node server/server --port 9000