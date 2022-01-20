const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

function processScoreCard(url) {
  request(url, cb);
}

function cb(err, response, html) {
  if (err) {
    console.log(err);
  } else {
    extractMatchDetails(html);
  }
}

function extractMatchDetails(html) {
  let $ = cheerio.load(html);
  //   console.log(html);

  let event = $(".header-info .description");
  let result = $(".event .status-text");

  let stringArr = event.text().split(",");

  let venue = stringArr[1].trim();
  let date = stringArr[2].trim();
  let Result = result.text();

  //   console.log(venue, date, Result);

  let innings = $(".card.content-block>.Collapsible");

  //   let htmlStr = "";

  for (let i = 0; i < innings.length; i++) {
    // htmlStr += $(innings[i]).html();

    let teamname = $(innings[i]).find("h5").text().split("INNINGS")[0].trim();
    let opponentidx = i == 0 ? 1 : 0;

    let opponentname = $(innings[opponentidx])
      .find("h5")
      .text()
      .split("INNINGS")[0]
      .trim();

    // console.log(teamname, opponentname);

    let allRows = $(innings[i]).find(".table.batsman tr");

    for (let j = 0; j < allRows.length; j++) {
      let allCols = $(allRows[j]).find("td");

      if ($(allCols[0]).hasClass("batsman-cell")) {
        // console.log(j);
        let playerName = $(allCols[0]).text().trim();
        let runs = $(allCols[2]).text().trim();
        let balls = $(allCols[3]).text().trim();
        let fours = $(allCols[5]).text().trim();
        let sixs = $(allCols[6]).text().trim();
        let strikeRate = $(allCols[7]).text().trim();

        console.log(
          `team:${teamname}  opponent:${opponentname}  ${venue}  date:${date}  player:${playerName}  runs:${runs} balls:${balls}  fours:${fours}  sixs:${sixs} strikeRate:${strikeRate}`
        );

        processPlayer(
          teamname,
          opponentname,
          playerName,
          venue,
          date,
          runs,
          balls,
          fours,
          sixs,
          strikeRate
        );
      }
    }
  }

  //   console.log(htmlStr);
}

function processPlayer(
  teamname,
  opponentname,
  playerName,
  venue,
  date,
  runs,
  balls,
  fours,
  sixs,
  strikeRate
) {
  let teamPath = path.join(__dirname, "ipl", teamname);
  dirCreator(teamPath);
  let filePath = path.join(teamPath, playerName + ".xlsx");
  let content = excelReader(filePath, playerName);

  let playerObj = {
    teamname,
    opponentname,
    playerName,
    venue,
    date,
    runs,
    balls,
    fours,
    sixs,
    strikeRate,
  };

  content.push(playerObj);

  excelWriter(filePath, content, playerName);
}

function dirCreator(path) {
  if (fs.existsSync(path) == false) {
    fs.mkdirSync(path);
  }
}

function excelWriter(filePath, json, sheetName) {
  // creates a new workbook
  let newWb = xlsx.utils.book_new();

  //   converts json file into excel sheet
  let newWs = xlsx.utils.json_to_sheet(json);
  // adds the sheet in the workbook
  xlsx.utils.book_append_sheet(newWb, newWs, sheetName);

  //   writes all the data in newwb in the file of the given file path
  xlsx.writeFile(newWb, filePath);
}

// read excel file using xlsx

function excelReader(filePath, sheetName) {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  // reads the content of the file of the given filepath and stores it in wb.
  let wb = xlsx.readFile(filePath);

  //   finds the sheet in the workbook of the required sheetname
  let excelData = wb.Sheets[sheetName];

  //   converts the excel sheet into json document
  let ans = xlsx.utils.sheet_to_json(excelData);
  return ans;
}

module.exports = {
  scoreCardKey: processScoreCard,
};
