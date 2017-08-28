var fs = require("node-fs")
// inserting crawlers
var jListCrawler = require('./crawler/jListCrawler')
var jDetailsCrawler = require('./crawler/jDetailsCrawler')
//inserting scrapper
var jListScrapper = require('./scrapper/jList-scrapper')
var jDetailScrapper = require('./scrapper/jDetails-scrapper')
// inserting scrapper configs
var jListScrapAConf = fs.readFileSync("./scrapper/jList-config-a.json")
var jListScrapBConf = fs.readFileSync("./scrapper/jList-config-b.json")
var jDetailsScrapAConf = fs.readFileSync("./scrapper/jDetails-config-a.json")


// var ListItem = require('./models/list-item')
var db = require('./mydb/dbController')

var fileWriter = require('./mydb/fileWriter')
var filePathJobs = "./jList.json"
var fileContentJobs = fs.readFileSync(filePathJobs)
var filePathHTML = "./lastHTML.html"

// variables
// var tempJobs = {
//   "found": [],
//   "new": []
// }

var jobCounter ={
  'dbjobs': 0,
  'found': 0,
  'new': 0
}



db.getAllListItems(function(content) {
  jobCounter.dbjobs = content.length
})

jListCrawler.crawl(function(content) {
  var obj = jListScrapper.extractJobURLs(content, JSON.parse(jListScrapAConf))
  console.log(obj.jobs.length, 'jobs found in list')
  if (!obj.jobs.length) {
    console.log('trying jListScrapBConfigs')
    obj = jListScrapper.extractJobURLs(content, JSON.parse(jListScrapBConf))
  }
  if (!obj.jobs.length) {
    // if obj.jobs is empty then procede with founded jobs and
    // return "e" to stop the crawler
    // console.log("I found ", tempJobs.found.length, " jobs")
    // console.log("We have ", queue.jobs.length, " jobs in db")
    // console.log("______queue is:", queue.jobs)
    // console.log("______tempJobs.found is:", tempJobs.found)
    // checkFoundedJobs(queue.jobs)
    // fileWriter.writeLastHTMLFile(obj.lastHTML, filePathHTML)
    dosome()
    return "e"
  }

  //
  //
  obj.jobs.forEach(function(el) {
    // console.log(el)
    // console.log(Object.prototype.toString.call(el.location))
    jobCounter.found ++
    return jobCounter.new + db.findOrInsertListItem(el)
    // tempJobs.found.push(el)
  })
})

function dosome() {
  console.log("done crawling job list")
  console.log("____found ", jobCounter.new, "new jobs")
  console.log("____found ", jobCounter.found, "jobs online")
  console.log("____found that ", jobCounter.dbjobs - (jobCounter.found - jobCounter.new), "jobs must be depricated")
  db.getAllUrls(function(urllist){
    crawlDetails(urllist)
  })
}

function crawlDetails(list){
  jDetailsCrawler.crawl(list, function(content, currentListItemId){
    db.getListItemById(currentListItemId, function(ListItem) {
      jDetailScrapper.getDetails(content, JSON.parse(jDetailsScrapAConf), function(jobDetails){
        console.log("____the details object is:", jobDetails)
        if(jobDetails.jobtask === null || jobDetails.jobreq === null || jobDetails.companyoffers === null){
          console.log('____some of jobDetails is empty. jobDetails are:', jobDetails)
          return db.removeListItem(currentListItemId)
        }
        if(ListItem.JobRefference === null){
          // insert job
          // update currentListItem with saved JobRefference
          return db.insertJob({
            title: ListItem.title,
            company: ListItem.company,
            location: ListItem.location,
            date: ListItem.date,
            url: ListItem.url,
            jobdetails: jobDetails
          }, currentListItemId)
        }
      })
    })
  })
}


// var queue = {
//   "jobs": []
// }

// var queue

// function getJobsFromFile(){
//   queue = JSON.parse(fileContentJobs)
// }
// getJobsFromFile()
// console.log(queue)

// //*** give me all urls in db, sort and print to console them to see if duplicates there
// db.getAllUrls(function(results){
//   var array = []
//   results.forEach(function (job) {
//     array.push(job.url)
//   })
//   array.sort()
//   console.log(array)
// })


// function checkFoundedJobs(array) {
//
//   if (!tempJobs.found.length) {
//     console.log("___tempJobs.found is empty")
//     queue.jobs = array
//     return dosome()
//   }
//   if(!queue.jobs.length){
//     console.log("___queue.jobs is empty")
//     Array.prototype.push.apply(tempJobs.new, tempJobs.found)
//     return dosome()
//   }
//   var tempArray = []
//   var currentFoundJob = tempJobs.found.pop()
//   tempArray = array.filter(function(job){
//     // console.log(currentFoundJob.url)
//     return (job.url != currentFoundJob.url)
//   })
//   if(tempArray.length == array.length){
//     tempJobs.new.push(currentFoundJob)
//   }
//   checkFoundedJobs(tempArray)
// }
