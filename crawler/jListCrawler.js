var Crawler = require('simplecrawler');
var cheerio = require('cheerio');

module.exports.crawl = function(callback) {
  var crawler = new Crawler('https://www.stepstone.de/5/resultlistpage?fu=1000000&li=100&of=15600&suid=f1647265-5722-457f-856c-8f03961cd284&an=paging_next');
  // var crawler = new Crawler('https://www.stepstone.de/jobs/IT.html?clickedMainCategory=true&noAutoJaSlider=true');

  // Settings
  crawler.interval = 10500; // Ten seconds
  crawler.maxConcurrency = 1;

  crawler.userAgent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.46 Safari/537.36"

  crawler.respectRobotsTxt=false;

  // crawler.maxDepth = 1;

  var urls = [];
  // var initialURL = 'https://www.stepstone.de/5/resultlistpage?fu=1000000&li=100&of=0&suid=52ff970a-0eea-49ca-aeab-95fd7fcdf469';

  // crawler.addFetchCondition(function(queueItem, referrerQueueItem, callback) {
  //
  //   // parsedURL.path.match(/\.(css|jpg|pdf|docx|js|png|ico)/i))
  // });



  crawler.discoverResources = function(buffer) {
    var nextPageUrlVar = parseInt(crawler.queue[crawler.queue.length -1].url.split('&')[2].split('=')[1]) + 100;
    var urlVars = crawler.queue[crawler.queue.length -1].url.split('&');
    return [
      urlVars[0] + "&" + urlVars[1] + "&" + "of=" + nextPageUrlVar + "&" + urlVars[3]
    ];
  };

  crawler.on("crawlstart", function() {
    console.log("Crawler started!");
    // console.log(crawler.queue[0].url);
  });

  crawler.on("queueadd", function(queueItem) {
    console.log("queueadd fired:", queueItem);
  });

  crawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
    console.log("fetchcomplete");
    // console.log("the queue is:", crawler.queue);
    if(callback(responseBuffer) === "e"){
      console.log("crawler stop()")
      crawler.stop();
    }
  });

  crawler.on("discoverycomplete", function(queueItem, resources) {
    // console.log("discovery is complete" );
    // console.log("queueItem is: ", queueItem);
    // console.log("resources are: ", resources);
    // console.log("the queue is:", crawler.queue);
  })

  // crawler error handling
  crawler.on("queueerror", function(error, urldata) {
    console.log("queueerror:", error);
  });
  crawler.on("invaliddomain", function(error) {
    console.log("invaliddomain:", error);
  });
  crawler.on("fetchdisallowed", function(error) {
    console.log("fetchdisallowed:", error);
  });
  crawler.on("fetch404", function(queueItem, responseObject) {
    console.log("fetch404:", queueItem, responseObject);
  });
  crawler.on("fetch410", function(queueItem, responseObject) {
    console.log("fetch410:", queueItem, responseObject);
  });

  crawler.start();
}
