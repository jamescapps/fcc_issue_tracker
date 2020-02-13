/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http')
const chai = require('chai')
const assert = chai.assert
const server = require('../server')
const Issue = require('../models/new_issue.model')

chai.use(chaiHttp)

suite('Functional Tests', () => {
  
    suite('POST /api/issues/{project} => object with issue data', () => {
      
      test('Every field filled in', (done) => {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title')
          assert.equal(res.body.issue_text, 'text')
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in')
          assert.equal(res.body.assigned_to, 'Chai and Mocha')
          assert.equal(res.body.status_text, 'In QA')      
          done()
        })
      })
      
      test('Required fields filled in', (done) => {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Title',
            issue_text: 'text',
            created_by: 'James'
          })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.issue_title, 'Title')
            assert.equal(res.body.issue_text, 'text')
            assert.equal(res.body.created_by, 'James')
            done()
          })
      })
      
      test('Missing required fields', (done) => {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            assigned_to: 'Chai and Mocha',
            status_text: 'In QA'
          })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'Please enter required fields')
            done()
          })
      })
      
    })
    
    suite('PUT /api/issues/{project} => text', () => {
      
      test('No body', (done) => {
        chai.request(server)
          .put('/api/issues/test')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'no updated field sent')
            done()
          })
      })
      
     test('One field to update', (done) => {
        //Have to save an issue to update it.
        const testIssue = new Issue ({
          issue_title: 'Test Issue',
          issue_text: 'This is a test issue.',
          created_by: 'James'
        })
        testIssue.save() 
          .then((result) => {
            chai.request(server)
            .put('/api/issues/test')
            .send({
              _id: result._id,
              issue_title: 'Change Title'
            })
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.equal(res.text, 'successfully updated')
              done()
            })
          })
          .catch(err => console.log(err))
      })
      
      test('Multiple fields to update', (done) => {
        //Have to save an issue to update it.
        const testIssue = new Issue ({
          issue_title: 'Test Issue',
          issue_text: 'This is a test issue.',
          created_by: 'James'
        })
        testIssue.save() 
          .then((result) => {
            chai.request(server)
            .put('/api/issues/test')
            .send({
              _id: result._id,
              issue_title: 'Change Title',
              issue_text: 'I am also changing the text.'
            })
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.equal(res.text, 'successfully updated')
              done()
            })
          })
          .catch(err => console.log(err))
      })
      
    })
    
    suite('GET /api/issues/{project} => Array of objects with issue data', () => {
      
      test('No filter', (done) => {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.property(res.body[0], 'issue_title')
          assert.property(res.body[0], 'issue_text')
          assert.property(res.body[0], 'created_on')
          assert.property(res.body[0], 'updated_on')
          assert.property(res.body[0], 'created_by')
          assert.property(res.body[0], 'assigned_to')
          assert.property(res.body[0], 'open')
          assert.property(res.body[0], 'status_text')
          assert.property(res.body[0], '_id')
          done()
        })
      })
      
      test('One filter', (done) => {
        chai.request(server)
          .get('/api/issues/test')
          .query({open: true})
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.isArray(res.body)
            assert.property(res.body[0], 'issue_title')
            assert.property(res.body[0], 'issue_text')
            assert.property(res.body[0], 'created_on')
            assert.property(res.body[0], 'updated_on')
            assert.property(res.body[0], 'created_by')
            assert.property(res.body[0], 'assigned_to')
            assert.property(res.body[0], 'open')
            assert.property(res.body[0], 'status_text')
            assert.property(res.body[0], '_id')
            assert.equal(res.body[0].open, true )
            done()
          })
      })
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', (done) => {
        chai.request(server)
          .get('/api/issues/test')
          .query({
            issue_title: 'Title',
            open: true
          })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.isArray(res.body)
            assert.property(res.body[0], 'issue_title')
            assert.property(res.body[0], 'issue_text')
            assert.property(res.body[0], 'created_on')
            assert.property(res.body[0], 'updated_on')
            assert.property(res.body[0], 'created_by')
            assert.property(res.body[0], 'assigned_to')
            assert.property(res.body[0], 'open')
            assert.property(res.body[0], 'status_text')
            assert.property(res.body[0], '_id')
            assert.equal(res.body[0].issue_title, 'Title')
            assert.equal(res.body[0].open, true )
            done()
          })
      })
      
    })
    
    suite('DELETE /api/issues/{project} => text', () => {
      
      test('No _id', (done) => {
        chai.request(server)
            .delete('/api/issues/test')
            .send({_id: ''})
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.equal(res.text, '_id error')
              done()
            })

      })
      
      test('Valid _id', (done) => {
        //Have to save an issue to update it.
        const testIssue = new Issue ({
          issue_title: 'Test Issue',
          issue_text: 'This is a test issue.',
          created_by: 'James'
        })
        testIssue.save() 
          .then((result) => {
            chai.request(server)
                .delete('/api/issues/test')
                .send({_id: result._id})
                .end((err, res) => {
                  assert.equal(res.status, 200)
                  assert.equal(res.text, 'deleted ' + result._id)
                  done()
                })
          })
          .catch(err => console.log(err))
      })
      
    })

})
