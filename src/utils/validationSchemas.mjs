export const createUserValidationSchema = {
  username: {
    isLength: {
      errorMessage: "Username must be 3-10 characters long",
      options: { min: 3, max: 10 },
    },
    notEmpty: {
      errorMessage: "Username cannot be empty",
    },
    isString: {
      errorMessage: "Username must be a string",
    },
  },
  displayName: {
    notEmpty: {
      errorMessage: "Display name cannot be empty",
    },
  },
};
