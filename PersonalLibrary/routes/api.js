/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
// var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');
// const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
mongoose.connect(process.env.DB)
var Schema = mongoose.Schema
var bookSchema = new Schema({
  title: {type: String, required: true},
  commentcount: Number,
  comments: [String]
})
var Book = mongoose.model('Book', bookSchema)

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      Book.find({}, (err, books) => {
        if (err) {
          res.json({error: err})
          return
        } else if (!books) {
          res.json({error: 'no book exists'})
          return
        }
        res.json(books)
      })
    })

    .post(function (req, res){
      var title = req.body.title;
      if (!title) {
        res.json({error: 'No book title provided'})
        return
      }
      //response will contain new book object including atleast _id and title
      var book = new Book()
      book.title = title
      book.commentcount = 0
      book.save((err, book) => {
        if (err) {
          res.json({error: err})
          return
        }
        res.json(book)
      })
    })

    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      if (!bookid) {
        return
      }
      Book.findOne({_id: bookid}, (err, book) => {
        if (err) {
          res.json({error: 'cannot find book'});
          return
        } else if (!book) {
          res.json({error: 'no book exists'})
          return
        }
        res.json(book)
      })
    })

    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      Book.findByIdAndUpdate(
        {_id: bookid},
        {$push: {comments: comment}, $inc: {commentcount: 1}},
        {new : true},
        (err, book) => {
          if (err) {
            res.json({error: err})
            return
          } else if (!book) {
            res.json({error: 'no book exists'})
            return
          }
          res.json(book)
        }
      )
    })

    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });

};
