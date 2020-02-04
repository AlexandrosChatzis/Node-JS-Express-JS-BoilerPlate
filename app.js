const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const flash = require("express-flash");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
require("dotenv/config");
const app = express();

//Require Passport config
require("./config/passport")(passport);

//Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);

//Connect Flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.name = req.flash("name");
  next();
});

//Body Parser AKA CRSF
const bodyParser = require("body-parser");

//EJS view engine changing delimeter
app.use(expressLayouts);
// ejs.delimiter = "?";
app.set("view engine", "ejs");

//Import Routes
const postsRoute = require("./routes/posts");
const usersRoute = require("./routes/users");
const indexRoute = require("./routes/index");

//Middlewares

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//cors connects domains for access
app.use(cors());
// Express body parser
app.use(express.urlencoded({ extended: true }));

//API JSON PARSER
app.use(bodyParser.json());

//ROUTES
app.use("/posts", postsRoute);
app.use("/", usersRoute);
app.use("/", indexRoute);

//CONNECT TO DB
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connection granted");
  }
);

//listening
app.listen(3000);
