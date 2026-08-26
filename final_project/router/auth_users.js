const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
//Check if the username already exists in the users array
let userswithssamename = user.filter((user) =>{
    return (user.username===username && user.password === password);
});
return validusers.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
//Check if username and passwordmatch any registered user
let validusers =users.filter((user) => {
    return (user.username === username && user.password === password);
});
return validusers.length > 0;
}

//only registered users can login
//Login route for regisstered users
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} =req.body;

  if (!username || !password) {
    return res.status(404). json({ message:"Error logging in. Provide username and password." });
  }

  if (authenticatedUser(username, password)) {
    //Generate JWT Access Token
    let accessToken = jwt.sign({
        data: username
    }, 'access', { expiresIn: 60 * 60 });

    //Save token to session
    req.session.authorization ={
        accessToken, username
    };

    return res.status(200).send("User sucessful loggedin");
} else {
    
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
