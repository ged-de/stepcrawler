var mongoose = require('mongoose')

var ListItemSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: [{
    type: String
  }],
  date: Date,
  url: String,
  rltrs: [{
    type: String
  }],
  jobrefference: String
})
// module.exports = mongoose.model('Listings', ListItemSchema)
module.exports = ListItemSchema
