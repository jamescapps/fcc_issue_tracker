const mongoose = require('mongoose')
const Schema = mongoose.Schema

const issueSchema = new Schema(
    {
        issue_title: {type: String, required: true },
        issue_text: {type: String, required: true },
        created_by: {type: String, required: true },
        assigned_to: String,
        status_text: String,
        created_on: Date,
        updated_on: Date,
        open: Boolean
    }
)

const Issue = mongoose.model('Issue', issueSchema)

module.exports = Issue