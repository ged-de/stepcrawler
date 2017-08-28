var cheerio = require('cheerio');
var fileWriter = require('../mydb/fileWriter');
// var dbWriter = require('../fileWriter/dbWriter');

module.exports.extractJobURLs = function(html, config) {
  var $ = cheerio.load(html, { decodeEntities: false });

  var path = './jList.json';
  var obj = {
    'jobs':[],
    'lastHTML' : ''
  };
  // flag = "w"

  $(config.article.base).each(function(){
    // console.log($(config.article.title, this).html());
    obj.jobs.push({
        "title": $(config.article.title, this).html(),
        "company": $(config.article.company, this).html(),
        "location": $(config.article.location, this).html().trim().split(','),
        "date": Date.parse($(config.article.date).attr('datetime')),
        "url": $(config.article.url, this).attr('href').split('&')[0],
        "rltr": [$(config.article.url, this).attr('href').split('&')[1].split('=')[1]]
      });
  });
  // if obj.jobs are empty
  // for debugg issue save the last html that was fetched
  if(!obj.jobs.length){
    console.log('___jList-scrapper says obj.jobs is empty')
    obj.lastHTML = html
  }
  // // dbWriter.writeToDb(obj.jobs)
  // fileWriter.writeToFile(obj, path);
  // return flag;
  return obj;
}
