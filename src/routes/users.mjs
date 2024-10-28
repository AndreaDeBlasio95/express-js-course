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

const router = Router();

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
    const result = validationResult(req);
    console.log(result);
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

    const data = matchedData(req);
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
    mockUsers.push(newUser);
    return res.status(201).send(newUser);
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
