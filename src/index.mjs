import express from "express";

const app = express();

// Middleware
app.use(express.json());

const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};

const resolveIndexByUserId = (req, res, next) => {
  const {
    params: { id },
  } = req;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  if (findUserIndex === -1) return res.sendStatus(404);

  // attach the findUserIndex to the req object
  req.findUserIndex = findUserIndex;
  next();
};

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

app.get("/", (req, res) => {
  res.status(201).send({ msg: "Hello World" });
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
  const { body } = req;
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
  mockUsers.push(newUser);
  return res.status(201).send(newUser);
});

// Get a specific user
app.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;
  const findUser = mockUsers[findUserIndex];

  if (!findUser) return res.sendStatus(404);

  return res.send(findUser);
});

app.get("/api/products", (req, res) => {
  res.send([{ id: 1, productName: "berry", price: 2.99 }]);
});

// PUT: Update a specific user, update the entire user
app.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req; // destructure the body and findUserIndex from the req object

  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body }; // replace the existing user with the new user
  return res.sendStatus(200);
});

// PATCH: Update a specific user, update a portion of the user
app.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body }; // merge the existing user with the new user
  return res.sendStatus(200);
});

// DELETE: Delete a specific user
app.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;

  mockUsers.splice(findUserIndex, 1); // remove the user from the array

  return res.sendStatus(200);
});
