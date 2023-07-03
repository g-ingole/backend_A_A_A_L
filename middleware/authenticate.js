const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const keysecret = "gauravingolespecialkeycharactersofbackendnodeggiiu"


const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const verifyToken = jwt.verify(token, keysecret);

        const rootUser = await UserModel.findOne({ _id: verifyToken._id });  //"tokens.token": token

        if (!rootUser) { throw new Error("user not found") };
        req.token = token
        req.rootUser = rootUser
        req.userID = rootUser._id

        next();
    } catch (error) {
        res.status(401).json({ status: 401, message: "unautherized: No token provide" });

    }
}
module.exports = authenticate;
