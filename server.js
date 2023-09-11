const express = require("express"); //framework for node to make it a lot easier
const app = express();
const mongoose = require("mongoose"); //need mongoose for schemas and bonus methods
const passport = require("passport"); //middleware that comes with strategies to handle auth
const session = require("express-session"); //uses cookies stored on client side that checks it matches the sessions id in the database, to ensure even if the server restarted they are kept logged in
const MongoStore = require("connect-mongo")(session); //what is needed for mongo to store sessions as well
const methodOverride = require("method-override"); //form in html is limited to POST and GET, need this to be able to use DELETE and PUTs with forms
const flash = require("express-flash");//library for JS to handle flash messages, essentially when you put in incorrect information
const logger = require("morgan");//logs stuff for you without breaking DPA
const connectDB = require("./config/database"); //go to config to connec to our DB, rather than just putting the connection in server.js
const cors = require('cors');
const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comment");
const userRoutes = require("./routes/user")
//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

//Connect To Database
connectDB();

//Using EJS for views
app.set("view engine", "ejs");

//Static Folder
app.use(express.static("public"));

//CORS
app.use(cors());

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev")); //dev is a more indepth morgan format, it will show you a tonne of information, such as response times

//Use forms for put / delete
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);
app.use("/user", userRoutes);

//Server Running
app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
});
