//Project Requires
const express = require("express");
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const {getUserByEmail, generateRandomString, urlsForUser} = require('./helpers.js');

//serverCreation
const app = express();
const PORT = 8080; // default port 8080

//resourses used in project
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key2', 'key2']

}));
app.set("view engine", "ejs");

//Data Base Objects
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  fja933: { longURL: "https://www.facebook.com", userID: "a" },
  mCmwpe: { longURL: "https://www.starbucks.ca", userID: "a" }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: '$2b$10$vPN8KssscSaMf49AwZ18o.XphfgLlc.mm.cHKaaOv8slUiSXHll6.'
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: '$2b$10$vPN8KssscSaMf49AwZ18o.XphfgLlc.mm.cHKaaOv8slUiSXHll6.'
  },
  "a": {
    id: "a",
    email: "a@a",
    password: '$2b$10$vPN8KssscSaMf49AwZ18o.XphfgLlc.mm.cHKaaOv8slUiSXHll6.'
  },
};


// GET home page 
app.get("/", (req, res) => {
  res.send("Hello!");
});
//Get hyper link to long url 
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});
//GET the json verson on the database 
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
//default hello page and message 
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
//easteregg page for the lols
app.get("/easteregg", (req, res) => {
  res.send("<html><body>  ¯\_(ツ)_/¯ <b> U made it. </b></body></html>\n");
});
//main page 
app.get("/urls", (req, res) => {
  const id = req.session.user_id;
  const userUrls = urlsForUser(id, urlDatabase);
  const templateVars = { urls: urlDatabase, user_id: id, users, userUrls};
  //if there is no active user redirect to home page 
  if (req.session.user_id) {
    res.render("urls_index", templateVars);
  } else {
    res.render("login", templateVars);
  }
});
//page for creating new urls
app.get("/urls/new", (req, res) => {
  const templateVars = {user_id: req.session.user_id, users};
  //if there is no active user the redirect to the log in page 
  if (req.session.user_id) {
    res.render("urls_new", templateVars);
  } else {
    res.render("login", templateVars);
  }
});
//display the shortened url page 
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user_id: req.session.user_id, users};
  res.render("urls_show", templateVars);
});
//display the register page 
app.get("/register", (req, res) => {
  const templateVars = { email: "", user_id: req.session.user_id, users};
  res.render("register", templateVars);
});
//display the login page 
app.get("/login", (req, res) => {
  const templateVars = { email: "", user_id: req.session.user_id, users};
  res.render("login", templateVars);
});
//create now shortened url to add to the data base 
app.post("/urls", (req, res) => {
  const r = generateRandomString();
  urlDatabase[r] = {longURL: req.body.longURL, userID: req.session.user_id };
  res.redirect(`/urls/${r}`);
});
//Delete url from the data base 
app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session.user_id) {
    delete urlDatabase[req.params.shortURL];
  }
  res.redirect("/urls");
});
//update url
app.post("/urls/:shortURL", (req, res) => {
  if (req.session.user_id) {
    urlDatabase[req.params.shortURL].longURL = req.body.newURL;
  }
  res.redirect("/urls");
});
//handle user log in 
app.post("/login", (req, res) => {
  //store the incoming email and password fields
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email, users);
  //check if user exists 
  if (!user) {
    return res.status(403).send("email not found");
  }
  if (!bcrypt.compareSync(password, user.password)) { //check if password matches the one in our database 
    return res.status(403).send("incorrect password");
  }
  //set the cookie the redirect to home page 
  req.session.user_id = user.id;
  res.redirect("/urls");
});
//logout by resetting the cookie 
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});
//handle registering 
app.post("/register", (req, res) => {
  //hash the incoming password 
  const password = bcrypt.hashSync(req.body.password, 10);
  const email = req.body.email;
  //check if both fields have data 
  if (email.length === 0 || req.body.password.length === 0) {
    return res.status(400).send("oops u forgot to fill in one of the fields");
  }
  //check f the email already exists 
  if (getUserByEmail(email, users)) {
    return res.status(400).send("email exists in database pls dont hack me");
  }
  //create the user object and add it to the database then log the user in 
  const id = generateRandomString();
  const user = {id, email, password};
  users[id] = user;
  req.session.user_id = id;
  res.redirect("/urls");
});

//listen on port 
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});