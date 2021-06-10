const getUserByEmail = function (email, users){
  const keys = Object.keys(users);
  for(const key of keys){
    const user = users[key];
    if (user.email === email){
      return user;
    }
  }
  return undefined;
}

function generateRandomString() {
  let shortUrl = Math.random().toString(36).substring(7);
  return shortUrl;
}

const urlsForUser = function (id, db) {
  const keys = Object.keys(db);
  let returnArray = [];
  for(const key of keys){
    const shortURL = db[key];
    if (shortURL.userID === id){
      returnArray.push(key);
    }
  }
  return returnArray;
}


module.exports = { getUserByEmail, generateRandomString, urlsForUser };