const request = require("request");
const cheerio = require("cheerio");
const scoreCardKeyObj = require("./scoreboard.js");

function extractAllMacthesLink(url) {
  request(url, function (err, response, html) {
    if (err) {
      console.log(err);
    } else {
      extractMatchLink(html);
    }
  });
}

function extractMatchLink(html) {
  let $ = cheerio.load(html);

  let scoreCardElements = $(`a[data-hover="Scorecard"]`);

  for (let i = 0; i < scoreCardElements.length; i++) {
    let link = $(scoreCardElements[i]).attr("href");
    let fullLink = "https://www.espncricinfo.com" + link;
    // console.log(fullLink);
    scoreCardKeyObj.scoreCardKey(fullLink);
  }
}

module.exports = {
  allMatchKey: extractAllMacthesLink,
};
