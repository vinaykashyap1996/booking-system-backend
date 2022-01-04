const bcrypt = require("bcryptjs");
const Users = require("../../models/user");
const jwt = require("jsonwebtoken");
module.exports = {
  createUser: (args) => {
    return Users.findOne({ email: args.userInput.email })
      .then((user) => {
        if (user) {
          throw new Error("User already exists");
        }
        return bcrypt.hash(args.userInput.password, 12);
      })
      .then((hasedPassword) => {
        const user = new Users({
          email: args.userInput.email,
          password: hasedPassword,
        });
        return user
          .save()
          .then((result) => {
            return { ...result._doc, _id: result.id, password: null };
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
  },
  login: async ({ email, password }) => {
    const user = await Users.findOne({ email: email });
    if (!user) {
      throw new Error("user does not exist");
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      throw new Error("Passwords do not match");
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.Secret_key,
      {
        expiresIn: "1h",
      }
    );
    return {
      userid: user.id,
      Token: token,
      TokenExpiration: 1,
    };
  },
};
