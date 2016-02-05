@echo off
call ".\node_modules\.bin\babel.cmd" --presets react,es2015 .\src\babel -d .\src\js
call ".\node_modules\.bin\browserify.cmd" .\src\js\main.js -o .\public\js\bundle.js