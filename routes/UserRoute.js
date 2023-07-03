const express = require('express');
const UserRoute = new express.Router();
const UserModel = require('../models/UserModel');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// const authenticate = require("../middleware/authenticate");

UserRoute.get("/", async (req, res) => {
    const data = await UserModel.find()
    return res.send({ data })
});

// user register

UserRoute.post("/register", async (req, res) => {
    // console.log(req.body);
    const { fname, email, password, cpassword } = req.body;

    if (!fname || !email || !password || !cpassword) {
        res.status(422).json({ message: "Please fill all the fields" });
        console.log("no data avaible");
    };
    try {
        const preuser = await UserModel.findOne({ email: email });
        if (preuser) {
            res.status(422).json({ message: "Email already exists" });
        } else if (password !== cpassword) {
            res.status(422).json({ message: "Passwords do not match" });
        } else {
            const finalUser = new UserModel({
                fname, email, password, cpassword
            });


            // password hashing process

            const storeData = await finalUser.save();
            console.log(storeData);
            res.status(201).json({ status: 201, storeData });
        }
    } catch (error) {

    }

});


// user Login

UserRoute.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(422).json({ error: "fill the all data" })
    };
    try {
        const userValid = await UserModel.findOne({ email: email });
        if (userValid) {
            const isMatch = await bcrypt.compare(password, userValid.password);

            if (!isMatch) {
                res.status(422).json({ error: "password Not Match" })
            } else {
                // token genrate
                const token = await userValid.generateAuthtoken();

                // cookie generate
                res.cookie("usercookie", token, {
                    expires: new Date(Date.now() + 9000000),
                    httpOnly: true
                });
                const result = {
                    userValid,
                    token
                }
                res.status(201).json({ status: 201, result });
                // res.status(201).json({ message: "password Match" })
            }
        }
        // else {
        //     res.status(400).json({ error: "User Not Found" })
        // }
    } catch (error) {
        res.status(401).json({ error: "Invalid details" });
    }
});


// get valid user

// UserRoute.get("/validuser", authenticate, async (req, res) => {
//     try {
//         const validUserOne = await UserModel.findOne({ _id: req.userID });
//         res.status(201).json({ status: 201, validUserOne });
//     } catch (error) {
//         res.status(401).json({ status: 201, error });
//     }
// });





module.exports = UserRoute