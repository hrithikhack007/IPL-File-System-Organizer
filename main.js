const request = require("request");
const cheerio = require("cheerio");
const path = require("path");
const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const allMatchKeyObj = require("./allmatches.js");
const fs = require("fs");

const iplPath = path.join(__dirname, "ipl");
dirCreator(iplPath);

request(url, cb);

function cb(err, response, html) {
  if (err) {
    console.log(err);
  } else {
    extractLink(html);
  }
}

function extractLink(html) {
  let $ = cheerio.load(html);

  let anchorElement = $("a[data-hover='View All Results']");

  let link = $(anchorElement).attr("href");
  //   console.log(link);

  let fullLink = "https://www.espncricinfo.com" + link;
  allMatchKeyObj.allMatchKey(fullLink);
}

function dirCreator(path) {
  if (fs.existsSync(path) == false) {
    fs.mkdirSync(path);
  }
}
