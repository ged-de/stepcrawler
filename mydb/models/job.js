var mongoose = require('mongoose')

var JobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: [{
    type: String
  }],
  date: Date,
  url: String,
  jobdetails: {
    jobtask: {type: String, trim: true},
    jobreq: {type: String, trim: true},
    companyoffers: {type: String, trim: true}
  }
})
// module.exports = mongoose.model('Listings', ListItemSchema)
module.exports = JobSchema
