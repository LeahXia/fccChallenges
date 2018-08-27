/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

var savedBookid

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({title: 'Gone Girl'})
        .end(function(err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.body.title, 'Gone Girl')
          assert.isOk(res.body._id)
          savedBookid = res.body._id
          done();
        })
      });

      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.body.error, 'No book title provided')
            done();
          })
        });

    });


    suite('GET /api/books => array of books', function(){

      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isArray(res.body);
          assert.property(res.body[0], 'title')
          assert.property(res.body[0], 'commentcount')
          assert.property(res.body[0], '_id')
          done();
        })
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function(){

      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/83726')
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'cannot find book')
          done();
        })
      });

      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get('/api/books/'+savedBookid)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.title, 'Gone Girl')
          assert.isOk(res.body._id)
          assert.property(res.body, 'commentcount', 'book should has commentcount property')
          done();
        })
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){

      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post('/api/books/'+savedBookid)
        .send({comment: 'Awesome book!'})
        .end((err, res) => {
          // console.log('err', err);
          // console.log('res', res.body);
          assert.equal(res.status, 200)
          assert.isArray(res.body.comments)
          assert.include(res.body.comments, 'Awesome book!')
          assert.isOk(res.body.commentcount)
          done();
        })
      });

    });

  });

});
