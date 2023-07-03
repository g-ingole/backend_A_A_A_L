const express = require("express")
require("dotenv").config();

const app = express();
const connection = require("./config");
const UserRoute = require("./routes/UserRoute")

const cors = require("cors");
const cookieParser = require("cookie-parser");


app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/", UserRoute);

app.listen(process.env.PORT, async () => {
    try {
        await connection
        console.log("DB Connected");
    } catch (error) {
        console.log(error);
    }
    console.log(`db connected at port ${process.env.PORT}`);
})