const bcrypt = require("bcryptjs");
const Users = require("../../models/user");

module.exports = {
    createUser: (args) => {
        return Users.findOne({ email: args.userInput.email }).then(user => {
            if (user) {
                throw new Error("User already exists")
            }
            return bcrypt.hash(args.userInput.password, 12)

        }).then(hasedPassword => {

            const user = new Users({
                email: args.userInput.email,
                password: hasedPassword,

            })
            return user.save().then(result => {
                return { ...result._doc, _id: result.id ,password:null}
            }).catch(err => {
                throw err;
            })

        }).catch(err => {
            throw err;
        })
    },
}