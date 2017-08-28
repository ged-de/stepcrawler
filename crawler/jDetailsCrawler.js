var Crawler = require('simplecrawler')
var cheerio = require('cheerio')

module.exports.crawl = function(list, callback) {
  var jobList = list
  var crawler = new Crawler(jobList[0].url)
  // var crawler = new Crawler('https://www.stepstone.de/jobs/IT.html?clickedMainCategory=true&noAutoJaSlider=true')

  // Settings
  crawler.interval = 10000 // Ten seconds
  crawler.maxConcurrency = 1
  // crawler.maxDepth = 1

  crawler.userAgent="Mozilla/5.0 (Macintosh Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.46 Safari/537.36"

  crawler.respectRobotsTxt=false

  crawler.discoverResources = function(buffer) {
    return [
      jobList[crawler.queue.length].url
    ]
  }


  crawler.on("crawlstart", function() {
    console.log("Crawler started!")
    // console.log(crawler.queue[0].url)
  })

  crawler.on("queueadd", function(queueItem) {
    console.log("queueadd fired:", queueItem)
  })

  crawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
    console.log("fetchcomplete")
    // console.log("the queue is:", crawler.queue)
    callback(responseBuffer, jobList[crawler.queue.length]._id)
  })

  crawler.on("discoverycomplete", function(queueItem, resources) {
    // console.log("discovery is complete" )
    // console.log("queueItem is: ", queueItem)
    // console.log("resources are: ", resources)
    // console.log("the queue is:", crawler.queue)
  })

  // crawler error handling
  crawler.on("queueerror", function(error, urldata) {
    console.log("queueerror:", error)
  })
  crawler.on("invaliddomain", function(error) {
    console.log("invaliddomain:", error)
  })
  crawler.on("fetchdisallowed", function(error) {
    console.log("fetchdisallowed:", error)
  })
  crawler.on("fetch404", function(queueItem, responseObject) {
    console.log("fetch404:", queueItem, responseObject)
  })
  crawler.on("fetch410", function(queueItem, responseObject) {
    console.log("fetch410:", queueItem, responseObject)
  })

  crawler.start()
}
