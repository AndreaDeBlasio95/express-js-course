import { Router } from "express";
import {
  query,
  validationResult,
  checkSchema,
  matchedData,
} from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";

const router = Router(); // the router is an object that provides methods to create routes
/**
 * * Router vs express:
 * Router is a class that provides methods to create routes,
 * express is an object that provides methods to create a server
 * * router.get vs app.get:
 * router.get is a method that creates a route for the GET HTTP method,
 * app.get is a method that creates a route for the GET HTTP method, but it is called on the express object
 * * There are no differences between router.get and app.get in terms of functionality.
 */

// GET: Get all users
router.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-10 characters long"),
  (req, res) => {
    console.log(req.session);
    console.log(req.sessionID);
    const result = validationResult(req);
    console.log(result);
    // destructuring the query object from the request object
    const {
      query: { filter, value },
    } = req;

    // when filter and value are undefined
    if (!filter && !value) return res.send(mockUsers);

    // when filter is defined and value is defined
    if (filter && value)
      return res.send(mockUsers.filter((user) => user[filter].includes(value)));

    return res.send(mockUsers);
  }
);

// Get a specific user
router.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;
  const findUser = mockUsers[findUserIndex];

  if (!findUser) return res.sendStatus(404);

  return res.send(findUser);
});

// POST: Create a new user
router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  (req, res) => {
    const result = validationResult(req);
    console.log(result);
    if (!result.isEmpty())
      return res.status(400).send({ errors: result.array() });

    const data = matchedData(req); // get the validated data from the request object
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data }; // create a new user object
    mockUsers.push(newUser); // add the new user to the array of users
    return res.status(201).send(newUser); // send the new user as a response
  }
);

// PUT: Update a specific user, update the entire user
router.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req; // destructure the body and findUserIndex from the req object

  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body }; // replace the existing user with the new user
  return res.sendStatus(200);
});

// PATCH: Update a specific user, update a portion of the user
router.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body }; // merge the existing user with the new user
  return res.sendStatus(200);
});

// DELETE: Delete a specific user
router.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;

  mockUsers.splice(findUserIndex, 1); // remove the user from the array

  return res.sendStatus(200);
});

export default router;

/**
 * * |----- Route Parameters -----|
 * Route parameters are used to capture values in the URL. They are
 * defined by a colon (:) followed by the parameter name.
 * For example, in the route
 * /api/users/:id
 * , :id is a route parameter.
 */

/**
 * * |----- Request Parameters -----|
 * req.params: An object containing properties mapped to the named
 * route “parameters”. For example, if you have the route
 * /api/users/:id
 * then the “id” property is available as
 * req.params.id.
 */

/**
 * * |----- Query Parameters -----|
 * Query parameters are used to filter or sort the data. They are defined
 * by a question mark (?) followed by the parameter name and value.
 * For example, in the route:
 * /api/users?filter=name&value=John
 * , filter and value are query parameters.
 * req.query:
 * An object containing a property for each query parameter.
 */

/**
 * * |----- Express Validator -----|
 * Express Validator is a set of middleware functions to validate the request
 * query("filter") - Validates the query parameter "filter"
 * validationResult(req) - Extracts the validation errors from the request and handles them
 *
 */
