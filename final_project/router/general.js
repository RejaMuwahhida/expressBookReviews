const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;
 if(username && password){
  if(isValid(username)){

    return res.status(404).json({message : "user alredy exists"});
  }
  else{
    users.push({"username":username,"password":password});
    return res.status(200).json({message : "user successfully registered,now you can login"});
  }
 }
 else{
  return res.status(404).json({message: "Unable to register"});
 }

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
   res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let avl_books = books[isbn-1];
  if(avl_books.length>0){
    res.send(JSON.stringify(avl_books[0],null));
  }else{
    res.send("wrong isbn given");
  }

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

  const author = req.body.author;
  let searched_book = books.filter((book)=>book["author"]===author);
  if(searched_book.length>0){
    res.send(searched_book[0]);
  }else{
    res.send("no such author found");
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

  const title= req.body.title;
  let searched_book = books.filter((book)=>book["title"]===title);
  if(searched_book.length>0){
    res.send(searched_book[0]);
  }else{
    res.send("no such book available");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
   const isbn = req.params.isbn;
  let searched_book = books[isbn-1];
  if(searched_book.length>0){
    res.send(searched_book[0].reviews);
  }else{
    res.send("book is not available");
  }
});

module.exports.general = public_users;
