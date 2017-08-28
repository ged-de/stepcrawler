var cheerio = require('cheerio')
var req = require('request')

module.exports.getDetails = function(html, config, callback) {
  var $ = cheerio.load(html, { decodeEntities: false })
  var iframeurl = 'https://www.stepstone.de' + $(config.article.basedetails).attr('src')
  // console.log("____the iframe is:", $('div.container.listing-container.js-listing-container').html())
  req(iframeurl, function(err, res, html) {
    console.log(iframeurl)
    console.log("html is:", html)
    if(err) return console.log("___error in requesting iframe: ", err)
    var $ = cheerio.load(html, { decodeEntities: false })
    callback( {
      "jobtask": $(config.article.jobtask).html(),
      "jobreq": $(config.article.jobreq).html(),
      "companyoffers": $(config.article.companyoffers).html()
    })
  })



  // var obj = {
  //   'jobs':[],
  //   'lastHTML' : ''
  // }
  // // flag = "w"
  //
  // $(config.article.base).each(function(){
  //   // console.log($(config.article.title, this).html())
  //   obj.jobs.push({
  //       "title": $(config.article.title, this).html(),
  //       "company": $(config.article.company, this).html(),
  //       "url": $(config.article.url, this).attr('href').split('&')[0],
  //       "rltr": [$(config.article.url, this).attr('href').split('&')[1].split('=')[1]]
  //     })
  // })
  // // if obj.jobs are empty
  // // for debugg issue save the last html that was fetched
  // if(!obj.jobs.length){
  //   console.log('___jList-scrapper says obj.jobs is empty')
  //   obj.lastHTML = html
  // }
  // // // dbWriter.writeToDb(obj.jobs)
  // // fileWriter.writeToFile(obj, path)
  // // return flag
  // return obj
}
