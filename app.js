if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const CancerData = require("./models/upload.js");

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

const multer = require("multer");
const { storage } = require("./cloudConfig.js");
const upload = multer({ storage });
const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
      secret: process.env.SECRET,
  },
  touchAfter: 24*60*60,
});

store.on("error", (error) => {
  console.log("Error in MONGO SESSION STORE: ", error);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
  },
};

async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
      console.log("Connection Succeeded");
  })
  .catch((err) => console.log(err))

app.use(session(sessionOptions));
app.use(flash());



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use("public/media/", express.static("./public/media"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.json());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});


let port = 8080;

app.listen(port, (req, res) => {
  console.log("Listening to the Port: http://localhost:8080/scan");
});

app.get("/scan", (req, res) => {
  res.render("index.ejs");
});

app.post("/scan", upload.single('file'), async (req, res) => {
  try {
    const { userName, fileType, scanType, textInput } = req.body;
    let filePath;

    if (fileType != 'text') {
      filePath = req.file.path; // Get file path for image or PDF
    }

    const formData = new CancerData({
      userName,
      fileType,
      scanType,
      filePath,
      textInput,
      cancerClass: [],
    });

    await formData.save();

    // Set a success flash message
    req.flash('success', 'Data Uploaded Successfully!');

    // Redirect back to the form or a success page
    res.redirect('/scan'); // Change this to your desired route
  } catch (error) {
    console.error(error);
    // Set an error flash message
    req.flash('error', 'Failed to submit form or predict cancer class');

    // Redirect back to the form or an error page
    res.redirect('/scan'); // Change this to your desired route
  }
});
