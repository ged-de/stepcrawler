var fs = require("fs");

module.exports.writeToFile = function(object, path) {
  fs.readFile(path, 'utf8', function(error, jList) {
    if(error){
      return console.error("write error:  " + error.message);
    }
    var obj = JSON.parse(jList);
    object.jobs.forEach(function(el) {
      obj.jobs.push(el);
    });
    json = JSON.stringify(obj);
    fs.writeFile(path, json, 'utf8', function(error) {
           if (error) {
              return console.error("write error:  " + error.message);
           }
          //  console.log("Successful Write to " + path);
    });
  });
}

module.exports.writeLastHTMLFile = function(html, path) {
  fs.readFile(path, 'utf8', function(error, someHTML) {
    if(error){
      return console.error("read error:  " + error.message);
    }
    someHTML = '';
    fs.writeFile(path, html, 'utf8', function(error) {
           if (error) {
              return console.error("write error:  " + error.message);
           }
          //  console.log("Successful Write to " + path);
    });
  });
}
