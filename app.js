if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const cloudinary = require("cloudinary").v2;

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const session = require("express-session");
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo");
const LocalStrategy = require("passport-local");
const passport = require("passport");
const flash = require("connect-flash");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use("public/media/", express.static("./public/media"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.json());

let port = 8080;

app.listen(port, (req, res) => {
  console.log("Listening to the Port: http://localhost:8080/scan");
});

app.get("/scan", (req, res) => {
  res.render("index.ejs");
});
