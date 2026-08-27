const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

//Check if the username already exists in the users array
const isValid = (username) => { 
    let userswithsamename = users.filter(user => user.username === username);
    return userswithsamename.length === 0; // true only when username is NOT taken
};


//Check if username and password match any registered user
const authenticatedUser = (username,password) => { 
//write code to check if username and password match the one we have in records.

let validusers =users.filter((user) => {
    return (user.username === username && user.password === password);
});
return validusers.length > 0;
}

//only registered users can login
//Login route for registered users
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} =req.body;

  if (!username || !password) {
    return res.status(403). json({ message:"Error logging in. Provide username and password." });
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

    return res.status(200).send("User successful logged in");
} else {
    
    return res.status(403).json({ message: "Invalid Login. Check username and password" });
}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review || req.body.review; // note or req.body.review
  const username = req.user.username; //extracted from verified JWT token 

  if (!review) {
    return res.status(400).json({message: "Review content is required"});
  }

  //Check if the book exists in your database
  if (!books[isbn] )  {
    //Add or update the review under the current user's username
    return res.status(404).json({message: "Book not found" });
  }
  //Ensure reviews object exists
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  //Add or update review
  books[isbn].reviews[username] = review;

    return res.status(200).json({ message: `Review for ISBN ${isbn} successfully posted.`});
});

regd_users.get('/review/:isbn', (req, res) => {
const isbn = req.params.isbn;
  
    // Book does not exist
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // No reviews exist
    if (!books[isbn].reviews || Object.keys(books[isbn].reviews).length === 0) {
      return res.json({ message: "No review found for this user on this book" });
    }
  
    // Reviews exist
    return res.json(books[isbn].reviews);
  });
  


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username; 

    if (books[isbn]) {
        let bookReviews = books[isbn].reviews;
        if (bookReviews && bookReviews[username]) {
            delete bookReviews[username];
            return res.status(200).json({ message: `Reviews for the ISBN ${isbn} posted by the user ${username} deleted.` });
        } else {
            return res.status(404).json({ message: "No review found for this user on this book" });
        }
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
