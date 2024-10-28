import express from "express";
import routes from "./routes/index.mjs";

const app = express();

app.use(express.json());
app.use(routes);

// process is a global object that provides information about the current Node.js process
// process.env is an object that stores and controls the environment in which the process runs
// PORT is a variable that stores the port number to use for the server
const PORT = process.env.PORT || 3000;

// the second parameter is a callback function that will be called when the server starts
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.status(201).send({ msg: "Hello World" });
});
