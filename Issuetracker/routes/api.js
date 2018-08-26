/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');
mongoose.connect(process.env.DB);

var Schema = mongoose.Schema;

var projectSchema = new Schema ({
  issue_title: {type: String, required: true},
  issue_text: {type: String, required: true},
  created_by: {type: String, required: true},
  assigned_to: String,
  status_text: String,
  created_on: Date,
  updated_on: Date,
  open: Boolean,
})

var Project = mongoose.model('Project', projectSchema)

// const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

    app.route('/api/issues/:project')

      .get(function (req, res){
        var project = req.params.project;
        Project.find(req.query, function(err, projects) {
          console.log(projects.length);
          res.send(projects)
        })
      })

      .post(function (req, res){
        var project = req.params.project;
        var issue_title = req.body.issue_title
        var issue_text = req.body.issue_text
        var created_by = req.body.created_by
        var assigned_to = req.body.assigned_to || ''
        var status_text = req.body.status_text || ''

        var created_on = Date()
        var updated_on = Date()
        var open = true

        if (issue_title == null || issue_text == null || created_by == null) {
          res.json({invalidInput:"Missing required fields"})
          return
        }

        var project = new Project();
        project.issue_title = issue_title
        project.issue_text = issue_text
        project.created_by = created_by
        project.assigned_to = assigned_to
        project.status_text = status_text
        project.created_on = created_on
        project.updated_on = updated_on
        project.open = open

        project.save(function(err, project) {
          if (err) {
            console.log('Mongoose Error ', err);
            return;
          } else if (!project) {
            console.log('Mongoose Error ', 'project is not saved');
            return;
          }

          res.json(project)
        })
      })

      .put(function (req, res){
        var project = req.params.project;
        var _id = new ObjectId(req.body._id);

        var updateQuery = {};
        if (req.body.issue_title) {
          updateQuery.issue_title = req.body.issue_title
        }
        if (req.body.issue_text) {
          updateQuery.issue_text = req.body.issue_text
        }
        if (req.body.created_by) {
          updateQuery.created_by = req.body.created_by
        }
        if (req.body.assigned_to) {
          updateQuery.assigned_to = req.body.assigned_to
        }
        if (req.body.status_text) {
          updateQuery.status_text = req.body.status_text
        }
        if (req.body.open) {
          updateQuery.open = req.body.open
        }

        if (!Object.keys(updateQuery).length) {
          res.send({result: "No new value for update"})
          return
        } else {
          updateQuery.updated_on = Date()
          Project.findByIdAndUpdate(_id, {$set: updateQuery}, (err, originalProject) => {
            if (err) {
              console.log('Error', err);
              res.send({error: err})
              return;
            } else if (!originalProject) {
              console.log('No originalProject');
              res.send({error: "No project has been found with this id"})
              return;
            }
            res.send(req.body);
          })
        }
      })

      .delete(function (req, res){
        var project = req.params.project;

        if (!req.body._id) {
          res.send({error: '_id error'});
          return;
        }

        var _id = new ObjectId(req.body._id);

        Project.deleteOne({_id: _id}, (err, doc) => {

          if (err) {
            var errorStr = 'could not delete ' + _id;
            res.send({error: errorStr});
            return;
          }

          if (doc.deletedCount < 1) {
            res.send({error: 'could not delete ' + _id})
          } else {
            var successStr = 'deleted ' + _id;
            res.send({success: successStr});
          }
        });
      });
};
