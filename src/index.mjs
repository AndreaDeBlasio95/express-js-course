import express from "express";

const app = express();

const mockUsers = [
  { id: 1, username: "andrea", displayName: "Andrea" },
  { id: 2, username: "mark", displayName: "Mark" },
  { id: 3, username: "larry", displayName: "Larry" },
];
// process is a global object that provides information about the current Node.js process
// process.env is an object that stores and controls the environment in which the process runs
// PORT is a variable that stores the port number to use for the server
const PORT = process.env.PORT || 3000;

// the first parameter is the route
// the second parameter is a callback function that will be called when the route is requested
app.get("/", (req, res) => {
  res.send("Hello, world!");
});
// Get all users
app.get("/api/users", (req, res) => {
  res.send(mockUsers);
});
// Get a specific user
app.get("/api/users/:id", (req, res) => {
  // req.params is an object that stores all the route parameters
  console.log(req.params);
  const parsedId = parseInt(req.params.id);
  console.log(parsedId);
  if (isNaN(parsedId)) {
    return res.status(400).send({ msg: "Bad Request: Invalid id" });
  }

  const findUser = mockUsers.find((user) => user.id === parsedId);
  if (!findUser) {
    return res.sendStatus(404);
  }

  return res.send(findUser);
});

app.get("/api/products", (req, res) => {
  res.send([{ id: 1, productName: "berry", price: 2.99 }]);
});
// the second parameter is a callback function that will be called when the server starts
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
