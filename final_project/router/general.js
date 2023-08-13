const express = require('express');
const fs = require('fs');
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
  }else{
    users.push({"username":username,"password":password});
    return res.status(200).json({message : "user successfully registered,now you can login"});
  }
 }else{
  return res.status(404).json({message: "Unable to register"});
 }
});

// Get the book list available in the shop
function getbooks(){
    return new Promise((resolve,reject)=>{
        const bookstosend = books;
        resolve(bookstosend);
    });
}
public_users.get('/',function (req, res) {
    getbooks().then(bookstosend=>{
        res.send(JSON.stringify(bookstosend,null,4));
    }).catch(error =>{
        res.status(500).send("error");
    });
});

public_users.get('/user',function (req, res) {
    res.send(users);
 });
 

// Get book details based on ISBN
function getbook(isbn){
    return new Promise((resolve,reject)=>{
        let book = books[isbn];
        if(book){
         resolve(book);
        }else{
          reject("error");
        }
    });
}
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    getbook(isbn).then(book=>{
        res.json(book);
    }).catch(error=>{
        res.status(500).send(`${error}`);
        res.send("wrong isbn given");
    });
});
  
// Get book details based on author
function getBookByAuthor(author){
    return new Promise((resolve,reject)=>{
        let searched_book = Object.values(books).filter((book)=>book.author===author);
        if(searched_book.length>0){
          resolve(searched_book[0]);
        }else{
          reject("no such author found");
        }
    });
}

public_users.get('/author/:author',function (req, res) {

  const author = req.params.author;
  getBookByAuthor(author).then(book=>{
    res.json(book);
}).catch(error=>{
    res.status(500).send(`${error}`);
});
});

// Get all books based on title
function getBookByTitle(title){
    return new Promise((resolve,reject)=>{
        let searched_book = Object.values(books).filter((book)=>book.title===title);
        if(searched_book.length>0){
          resolve(searched_book[0]);
        }else{
          reject("no such title found");
        }
       
    });
}

public_users.get('/title/:title',function (req, res) {

  const title= req.params.title;
  getBookByTitle(title).then(book=>{
    res.json(book);
}).catch(error=>{
    res.status(500).send(`${error}`);
});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
   const isbn = req.params.isbn;
  let searched_book = books[isbn];
  if(searched_book){
    res.json(searched_book["reviews"]);
  }else{
    res.send("book is not available");
  }
});

module.exports.general = public_users;
