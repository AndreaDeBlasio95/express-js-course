import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";

const app = express();

app.use(express.json()); // for parsing application/json (middleware), it parses incoming requests with JSON payloads

app.use(cookieParser("helloworld")); // for parsing cookies (middleware), it parses cookies attached to the client request object

app.use(
  session({
    secret: "andrea the dev",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 60 * 60 * 1000 },
  })
); // for creating a session middleware

app.use(routes); // use the routes from the index file

// process is a global object that provides information about the current Node.js process
// process.env is an object that stores and controls the environment in which the process runs
// PORT is a variable that stores the port number to use for the server
const PORT = process.env.PORT || 3000;

// the second parameter is a callback function that will be called when the server starts
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  req.session.visited = true; // setting a session variable called0o visited
  res.cookie("hello", "world", { maxAge: 30000, signed: true });
  res.status(201).send({ msg: "Hello" });
});

/** * |----- Middleware -----|
 * Middleware is a function that has access to the
 * request object (req),
 * the response object (res), and
 * the next function in the application’s request-response cycle.
 * The middleware will be executed for every request made to the server
 * * The middleware needs to be placed before the route that you want to use it with
 */
// Example
const exampleMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};
// Use the middleware
app.use(exampleMiddleware);
