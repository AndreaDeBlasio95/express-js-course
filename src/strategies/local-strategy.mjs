import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";

passport.serializeUser((user, done) => {
  console.log("Inside serializeUser");
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("Inside deserializeUser");
  console.log(id);
  try {
    const findUser = mockUsers.find((user) => user.id === id);
    if (!findUser) throw new Error("User Not Found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

// * validate the user, and call done() with the user object if the user is valid.
export default passport.use(
  new Strategy((username, password, done) => {
    try {
      const findUser = mockUsers.find((user) => user.username === username);
      if (!findUser) throw new Error("User not found");
      if (password !== findUser.password) throw new Error("Bad Credentials");
      console.log(`Username: ${username}, Password: ${password}`);
      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);
