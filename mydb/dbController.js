var mongoose = require('mongoose')
var ListItemSchema = require('./models/list-item')
var JobSchema = require('./models/job')

//connection to Mongodb instance running on=======
//local machine or anywhere=========================
var uri = 'mongodb://localhost:27017/scrawler'
var connection = mongoose.createConnection(uri)


//Create model===================================================
var ListItemModel = connection.model('ListItem', ListItemSchema)
var JobModel = connection.model('Job', JobSchema)


//function to insert doc into model NOTE "pass in your =======
//callback or do away with it if you don't need one"=========
var insertListItem = function(doc) {
  //here is where or doc is converted to mongoose object
  var newListItem = new ListItemModel(doc)
  //save to db
  newListItem.save(function(err) {
    if (err) return console.log("error in saving newListItem", err)
  })
}

var insertJob = function(doc, currentListItemId) {
  //here is where or doc is converted to mongoose object
  var newJob = new JobModel(doc)
  //save to db
  newJob.save(function(err, job) {
    if (err) return console.log("error in saving newListItem", err)
    ListItemModel.findByIdAndUpdate(
      currentListItemId,
      {'jobrefference': job._id},
      function (err, raw) {
        if (err) return handleError(err)
        console.log('The raw response from Mongo was ', raw)
      })
  })
}

// function to find doc with given url =======
// and save it if its not found =========
var findOrInsertListItem = function(job, callback) {
  url = job.url
  ListItemModel.findOne({
    'url': url
  }, '_id rltrs', function(err, dbJob) {
    if (err) return handleError(err)
    if (dbJob === null){
      // console.log('____dbJob is', dbJob)
      // console.log('____job is', job)
      insertListItem(job)
      return 1
    }else{
      if(!(dbJob.rltrs.indexOf(job.rltr) > -1)){
        console.log('the if is ', !(dbJob.rltrs.indexOf(job.rltr) > -1))
        console.log('the dbJob.rltrs is ', dbJob.rltrs)
        console.log('the job.rltr is ', job.rltr)
        ListItemModel.findByIdAndUpdate(
          dbJob._id,
          {'$push': {'rltrs': job.rltr}},
          function (err, raw) {
            if (err) return handleError(err)
            console.log('The raw response from Mongo was ', raw)
          })
      }
      return 0
    }
  })
}

var getListItemById = function(jobId, callback) {
  ListItemModel.findOne({'_id' : jobId}, 'title company location date url', function(err, results) {
    if (err) return handleError(err)
    callback(results)
  })
}

var removeListItem = function(jobId) {
  ListItemModel.findByIdAndRemove({'_id' : jobId}, function(err, results) {
    if (err) return handleError(err)
  })
}


//function to get all Job List Items====================================
var getAllListItems = function(callback) {
  ListItemModel.find({}, '_id url rltrs', function(err, results) {
    if (err) return handleError(err)

    //invoke callback with your mongoose returned result
    callback(results)
  })
}


var getAllUrls = function(callback) {
  var previousUrl
  ListItemModel.find({}, 'url', function(err, results) {
    callback(results)
  })
}

var connectionClose = function() {
  console.log("___closing connection")
  connection.close()
}


//you can add as many functions as you need.

//Put all of your methods in a single object interface
//and expose this object using module.

var ListItemManager = {
  insertListItem: insertListItem,
  insertJob: insertJob,
  getListItemById: getListItemById,
  removeListItem: removeListItem,
  findOrInsertListItem: findOrInsertListItem,
  getAllListItems: getAllListItems,
  getAllUrls: getAllUrls,
  connectionClose: connectionClose
}


module.exports = ListItemManager
