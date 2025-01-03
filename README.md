# express-js-course

Express JS Full Course

node -v
check the node version

npm init -y
will create a packega.json file

npm i express
install express

npm i -D nodemon
install nodemon as a Dev dependencie

Add these two lines in package.json -> scripts ->  
"start:dev": "nodemon ./src/index.js",
"start": "node ./src/index.js"

Add this line at the end on the package.json
"type": "module"
This allows the modern import/export syntax

Status Codes:
200: Post Request as Default
201: Post Request when the user creates a resource

When ever you are build an API you should prefix all of your endpoints with ("/api/")

npm i express-validator

npm i cookie-parser
cookie-parser is a middleware that parses cookies attached to the client request object

npm install express-session

Run the app:
npm run start:dev
