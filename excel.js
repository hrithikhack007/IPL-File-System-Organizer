const fs = require("fs");
const xlsx = require("xlsx");

const data = require("./example.json");

// console.log(data);

// data.push({ name: "Sandeep", lastname: "Gupta", college: "Aimms" });

stringData = JSON.stringify(data);

// fs.writeFileSync("example.json", stringData);
// console.log(data);

// write excel file using xlsx

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

// excelWriter("abc.xlsx", data, "sheet1");
