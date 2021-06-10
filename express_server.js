const express = require("express");
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session')
//const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080; // default port 8080


app.use(bodyParser.urlencoded({extended: true}));

//app.use(cookieParser());

app.use(cookieSession({
  name: 'session',
  keys: ['key2', 'key2']

}))


function generateRandomString() {
  let shortUrl = Math.random().toString(36).substring(7);
  return shortUrl;
}

const emailExists = function (email){
  const keys = Object.keys(users);
  for(const key of keys){
    const user = users[key];
    if (user.email === email){
      return user.id;
    }
  }
  return null;
}

const urlsForUser = function (id) {
  const keys = Object.keys(urlDatabase);
  let returnArray = [];
  for(const key of keys){
    const shortURL = urlDatabase[key];
    if (shortURL.userID === id){
      returnArray.push(key);
    }
  }
  return returnArray;
}

app.set("view engine", "ejs");

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
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const id = req.session.user_id;
  const userUrls = urlsForUser(id);
  console.log(userUrls);
  const templateVars = { urls: urlDatabase, user_id: id, users, userUrls};
  if(req.session.user_id){
    res.render("urls_index", templateVars);
  } else {
    res.render("login", templateVars);
  }
});

app.get("/urls/new", (req, res) => {
  const templateVars = {user_id: req.session.user_id, users};
  if(req.session.user_id){
    res.render("urls_new", templateVars);
  } else {
    res.render("login", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  console.log("testing: ", urlDatabase[req.params.shortURL].longURL);
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user_id: req.session.user_id, users};
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = { email: "", user_id: req.session.user_id, users};
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = { email: "", user_id: req.session.user_id, users};
  res.render("login", templateVars);
});

app.post("/urls", (req, res) => {
  const r = generateRandomString();
  urlDatabase[r] = {longURL: req.body.longURL, userID: req.session.user_id }; 
  console.log(urlDatabase);  // Log the POST request body to the console 
  res.redirect(`/urls/${r}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if(req.session.user_id){
    delete urlDatabase[req.params.shortURL];
  }
  //console.log(urlDatabase);  // Log the POST request body to the console 
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  if(req.session.user_id){
    urlDatabase[req.params.shortURL].longURL = req.body.newURL;
  }
  //console.log(urlDatabase);  // Log the POST request body to the console 
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  //console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  const user = emailExists(email);
  if(!user){
    return res.status(403).send("email not found");
  }
  if(!bcrypt.compareSync(password, users[user].password)){
    return res.status(403).send("incorrect password");
  }

  console.log("test: ", users[user]);
  req.session.user_id = users[user].id;

  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const password = bcrypt.hashSync(req.body.password, 10);
  const email = req.body.email;
  if(email.length === 0 || req.body.password.length === 0){
    return res.status(400).send("oops u forgot to fill in one of the fields");
  }
  console.log("email: ", email, "password: ", password);
  if(emailExists(email)){
    return res.status(400).send("email exists in database pls dont hack me");
  }
  const id = generateRandomString();
  const user = {id, email, password};
  users[id] = user;
  console.log(users);
  req.session.user_id = id;
  const templateVars = {email, users, user_id: req.session.user_id};
  res.redirect("/urls");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});