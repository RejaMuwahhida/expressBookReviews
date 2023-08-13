const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let ExistingUser = users.filter((user)=>user.username===username);

  if(ExistingUser.length>0){
    return true;
  }
  else{
    return false;
  }
}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return user.username===username && user.password===password
  });

  if(validusers.length>0){
    return true;
  }
  else{
    return false;
  }
  
}
regd_users.get('/user',function (req, res) {
    res.send(users);
 });
//only registered users can login
regd_users.post("/login", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password){
    return res.status(404).json({message : "Error.please provide username and password"});
  }

  if(authenticatedUser(username,password)){

    let accessToken = jwt.sign({data: password},'access',{expiresIn : 60*60});

    req.session.authorization = {accessToken,username};
    
    return res.status(200).json({message : "user successfully logged in"});
  }
  else{
    return res.status(208).json({message : "Invalid login.check usernam eand password"});
  }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  
  const isbn = req.params.isbn;
  const username = req.body.username;
  let review = req.body.reviews;
  let book = books[isbn];
  if(book){
   
      book.reviews[username] = review;
    
     
     books[isbn] = book;

     res.send(`The review for book with isbn ${isbn} is updated`);
  }else{
    res.send("book is not available");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
