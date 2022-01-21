echo %1

node parse.js src/%1.x

node generate.js asts/%1.x.asts

node dist/%1.js


:: to execute this file on the windows command props
:: type run.bat filename