module.exports = function (errorCode) {
  const API_ERRORS = {
    0: {
      code: 0,
      message: "Server error, please try again!",
    },
    1: {
      code: 1,
      message: "Email already in use!",
    },
    2: {
      code: 2,
      message: "Could not create a valid token after registration, please try to login!",
    },
    3: {
      code: 3,
      message: "No password was provided!!",
    },
    4: {
      code: 4,
      message: "No user found with this email!",
    },
    5: {
      code: 5,
      message: "Combination of email and password did not match any registered user!",
    },
    6: {
      code: 6,
      message: "Email and password must be present in the body!",
    },
    7: {
      code: 7,
      message: "Provided token was invalid!",
    },
    8: {
      code: 8,
      message: "There was no token provided!",
    },
    9: {
      code: 9,
      message: "You tried to update a todolist which did not belong to you!",
    }
  };

  return API_ERRORS[errorCode];
}
