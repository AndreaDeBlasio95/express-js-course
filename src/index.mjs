import express from "express";

const app = express();

// Middleware
app.use(express.json());

const mockUsers = [
  { id: 1, username: "andrea", displayName: "Andrea" },
  { id: 2, username: "mark", displayName: "Mark" },
  { id: 3, username: "larry", displayName: "Larry" },
];
// process is a global object that provides information about the current Node.js process
// process.env is an object that stores and controls the environment in which the process runs
// PORT is a variable that stores the port number to use for the server
const PORT = process.env.PORT || 3000;

// the second parameter is a callback function that will be called when the server starts
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// the first parameter is the route
// the second parameter is a callback function that will be called when the route is requested
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Get all users
app.get("/api/users", (req, res) => {
  console.log(req.query);
  // destructuring
  const {
    query: { filter, value },
  } = req;

  // when filter and value are undefined
  if (!filter && !value) return res.send(mockUsers);

  // when filter is defined and value is defined
  if (filter && value)
    return res.send(mockUsers.filter((user) => user[filter].includes(value)));

  return res.send(mockUsers);
});

// Post
app.post("/api/users", (req, res) => {
  console.log(req.body);
  const { body } = req;
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
  mockUsers.push(newUser);
  return res.status(201).send(newUser);
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

// PUT: Update a specific user, update the entire user
app.put("/api/users/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  if (findUserIndex === -1) return res.sendStatus(404);

  mockUsers[findUserIndex] = { id: parsedId, ...body }; // replace the existing user with the new user
  return res.sendStatus(200);
});

// PATCH: Update a specific user, update a portion of the user
app.patch("/api/users/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  if (findUserIndex === -1) return res.sendStatus(404);
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body }; // merge the existing user with the new user
  return res.sendStatus(200);
});

// PUT: Update the entire user, all fields, when not all fields are provided, they will be set to null
// PATCH: Update a portion of a specific user
// DELETE: Delete a specific user
