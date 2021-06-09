const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


function generateRandomString() {
  let shortUrl = Math.random().toString(36).substring(7);
  return shortUrl;
}

const emailExists = function (email){
  const keys = Object.keys(users);
  for(const key of keys){
    const user = users[key];
    if (user.email === email){
      return true;
    }
  }
  return false;
}

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user_id: req.cookies['user_id'], users};
  //console.log(templateVars);
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {user_id: req.cookies['user_id'], users};
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user_id: req.cookies['user_id'], users};
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = { email: "", user_id: req.cookies['user_id'], users};
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = { email: "", user_id: req.cookies['user_id'], users};
  res.render("login", templateVars);
});

app.post("/urls", (req, res) => {
  const r = generateRandomString();
  urlDatabase[r] = req.body.longURL; 
  //console.log(urlDatabase);  // Log the POST request body to the console 
  res.redirect(`/urls/${r}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  //console.log(urlDatabase);  // Log the POST request body to the console 
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.new;
  //console.log(urlDatabase);  // Log the POST request body to the console 
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  //console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  
  res.cookie('user_id', req.body.username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id')
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if(email.length === 0 || password.length === 0){
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
  res.cookie('user_id', id);
  const templateVars = {email, users, user_id: req.cookies['user_id']};
  res.redirect("/urls");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});