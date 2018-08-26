/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

var savedId

chai.use(chaiHttp);

suite('Functional Tests', function() {

    suite('POST /api/issues/{project} => object with issue data', function() {

      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
          assert.isOk(res.body.created_on, 'Has created_on time');
          assert.isOk(res.body.updated_on, 'Has updated_on time');
          assert.equal(res.body.open, true);
          savedId = res.body._id
          done();
        });
      });

      test('Required fields filled in', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Required fields filled in'
        })
        .end(function(err, res){
          // console.log(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Required fields filled in');
          done();
        });
      });

      test('Missing required fields', function(done) {
        chai.request(server)
         .post('/api/issues/test')
         .send({
           created_by: 'Functional Test - Missing required fields',
           assigned_to: 'Chai and Mocha',
           status_text: 'In QA'
         })
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.equal(res.body.invalidInput, 'Missing required fields');
           done();
         });
      });

    });

    suite('PUT /api/issues/{project} => text', function() {

      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({_id: savedId})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'No new value for update');
            done();
          })
      });

      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({_id: savedId, issue_title: 'UI Layout needs fix.'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'UI Layout needs fix.');
          done();
        })
      });

      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: savedId,
          issue_title: 'UI Layout needs fix.',
          issue_text: 'Auto layout is not properly set.',
          created_by: 'Leah',
          assigned_to: 'Leah',
          status_text: 'In Development',
          open: true
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'UI Layout needs fix.');
          assert.equal(res.body.issue_text, 'Auto layout is not properly set.');
          assert.equal(res.body.created_by, 'Leah');
          assert.equal(res.body.assigned_to, 'Leah');
          assert.equal(res.body.status_text, 'In Development');
          assert.equal(res.body.open, true);
          done();
        })
      });
    });

    suite('GET /api/issues/{project} => Array of objects with issue data', function() {

      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({issue_title: 'Title'})
        .end(function(err, res){
          // console.log('test err', err);
          // console.log('test res is Array? ', Array.isArray(res.body));
          // console.log('test res has title? ', res.body[0]);
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });

      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({issue_title: 'Title'})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.equal(res.body[0].issue_title, 'Title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        })
      });

      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
          issue_title: 'UI Layout needs fix.',
          issue_text: 'Auto layout is not properly set.',
          created_by: 'Leah',
          assigned_to: 'Leah',
          status_text: 'In Development',
          open: true
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body[0].issue_title, 'UI Layout needs fix.')
          assert.equal(res.body[0].issue_text, 'Auto layout is not properly set.')
          assert.equal(res.body[0].created_by, 'Leah')
          assert.equal(res.body[0].assigned_to, 'Leah')
          assert.equal(res.body[0].status_text, 'In Development')
          assert.equal(res.body[0].open, true)
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], '_id');
          done();
        })
      });

    });

    suite('DELETE /api/issues/{project} => text', function() {

      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send()
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, '_id error');
          done();
        })
      });

      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({_id: savedId})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.success, 'deleted ' + savedId);
          done();
        })
      });
    });

});
