const express = require("express");
const connectDb = require("./config/db");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoStore = require("connect-mongo")(session);
const passport = require("passport");

const app = express();
require('dotenv').config();
const PORT = process.env.PORT;

connectDb();
require("./models/User");
require("./models/Post");
require("./models/Comment")

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());

app.use(
    session({
        secret: "mysecretisthis",
        resave: false,
        saveUninitialized: true,
        store: new mongoStore({ mongooseConnection: mongoose.connection })
    })
);

require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", require("./routes/auth.js"));
app.use("/", require("./routes/index.js"));
app.use("/post", require("./routes/post.js"));
app.use("/comment", require("./routes/comment.js"));
app.use("/upload", require("./routes/upload.js"))
app.get("/internal-server-error", (req, res) => {
    res.render("error-500");
})
app.get("/*", (req, res) => {
    res.render("error-404");
})
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})

