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
const mongoose = require('mongoose')
const Issue = require('../models/new_issue.model')

//const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
mongoose.connect('mongodb://localhost/issue_tracker', { useUnifiedTopology: true, useNewUrlParser: true }) 

//Test connection
mongoose.connection.once('open', () => {
  console.log("Connected to database!")
})
module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      
    })
    
    .post(function (req, res){
      var project = req.params.project;
      var input = req.body

      /*if (input.issue_title === "" || input.issue_text === "" || input.created_by === "") {
        return res.send("Please enter required fields")
      }*/

      const newIssue = new Issue(
        {
          issue_title: input.issue_title,
          issue_text: input.issue_text,
          created_by: input.created_by,
          assigned_to: input.assigned_to,
          status_text: input.status_text,
          created_on: new Date(),
          updated_on: new Date(),
          open: true
        }
      )
      newIssue.save()
        .then(() => res.json(newIssue))
        .catch(err => res.status(400).json('Error: ' + err))
    })
    
    .put(function (req, res){
      var project = req.params.project;
      var input = req.body

      if (!input.issue_text && !input.issue_text && !input.assigned_to && !input.status_text) {
        res.send('no updated field sent')
      } else {
        const issueUpdate = (
          {
            issue_title: input.issue_title,
            issue_text: input.issue_text,
            created_by: input.created_by,
            assigned_to: input.assigned_to,
            status_text: input.status_text,
            updated_on: new Date()
          }
        )
  
        Issue.findByIdAndUpdate(input._id, issueUpdate, (err, result) => {
          if (err) {
            res.send(err)
          } else if (!result) {
            res.send('could not update ' + input._id)
          } else {
            res.send("successfully updated")
          }
        })
      }   
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      var input = req.body

      if (!input._id) {
        res.send('_id error')
      } else {
        Issue.findByIdAndDelete(input._id, (err, result) => {
          if (err) {
            res.send(err)
          } else if (!result) {
            res.json({failed: 'could not delete ' + input._id})
          } else {
            res.json({success: 'deleted' + input._id})
          }
        })
      }
    });
    
};
