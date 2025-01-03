import { mockUsers } from "./constants.mjs";

/** * |----- Middleware -----|
 * Middleware to resolve the index of a user by their ID
 * This middleware will be used in the GET /api/users/:id route
 * It will attach the index of the user to the req object
 */

export const resolveIndexByUserId = (req, res, next) => {
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
