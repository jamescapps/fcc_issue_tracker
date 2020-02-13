/*
*
*
*       Complete the API routing below
*
*
*/

'use strict'

const mongoose = require('mongoose')
const Issue = require('../models/new_issue.model')

mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
//mongoose.connect('mongodb://localhost/issue_tracker', { useUnifiedTopology: true, useNewUrlParser: true }) 

//Test connection
mongoose.connection.once('open', () => {
  console.log("Connected to database!")
})

module.exports = (app) => {

  app.route('/api/issues/:project')
  
    .get((req, res) => {
      Issue.find(req.query, (err, result) => {
        res.send(result)
      })
    })
    
    .post((req, res) => {
      let input = req.body

      if (!input.issue_title || !input.issue_text || !input.created_by) {
        return res.send("Please enter required fields")
      }

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
    
    .put((req, res) => {
      let input = req.body
      let issueUpdate

      if (!input.open && !input.issue_title && !input.issue_text && !input.assigned_to && !input.status_text) {
        res.send('no updated field sent')
        return
      } else if (input.open) {
          issueUpdate = ({open: input.open})
      } else {
         issueUpdate = (
          {
            issue_title: input.issue_title,
            issue_text: input.issue_text,
            created_by: input.created_by,
            assigned_to: input.assigned_to,
            status_text: input.status_text,
            updated_on: new Date(),
          }
        )
      }
        Issue.findByIdAndUpdate(input._id, issueUpdate, (err, result) => {
         if (!result) {
            res.send('could not update ' + input._id)
          } else if (err) {
            res.send(err)
          } else {
            res.send("successfully updated")
          }
        })
       
    })
    
    .delete((req, res) => {
      let input = req.body
        
      if (!input._id) {
        res.send('_id error')
        return
      }

      Issue.findByIdAndDelete(input._id, (err, result) => {
        if (err) {
          res.send('Error contacting database')
        } else if (!result) {
          res.send('could not delete ' + input._id)
        } else {
            res.send('deleted ' + input._id)
          }
        })
    })

}
