const sql = require("mssql");
const config = require("./dbconfig");

function formatTime(theTime) {
  theTime = new Date((typeof theTime === "string" ? new Date(theTime) : theTime).toLocaleString("en-US", { timeZone: "GMT" }));
  theTime = theTime.toString();

  dayOf = theTime.indexOf(" ") + 1;
  theTime = theTime.substring(dayOf);

  zoneName = theTime.indexOf("(") - 1;
  theTime = theTime.substring(0, zoneName);

  zoneID = theTime.lastIndexOf(" ");
  theTime = theTime.substring(0, zoneID);

  return theTime;
}
function CheckEmptyInput(input) {
  if (input.length == 0) {
    return "%";
  } else {
    return input;
  }
}
function CheckEmptyTime(input) {
  if (input.length == 0) {
    return "1970-01-02";
  } else {
    return input;
  }
}
function CreateTimeRange(input) {
  let years = parseInt(input.substring(0, 5));
  let months = parseInt(input.substring(5, 7));
  let days = parseInt(input.substring(8));

  if (input == "1970-01-02") {
    let today = new Date().toISOString().slice(0, 10);
    return today;
  } else if (months == 01 || months == 03 || months == 05 || months == 07 || months == 08 || months == 10 || months == 12) {
    //Months with 31 days
    if (days + 1 > 31) {
      if (months + 1 > 12) {
        years += 1;
        return years + "-01-" + "01";
      } else {
        months += 1;
        return years + "-" + months + "-01";
      }
    } else {
      days += 1;
      return years + "-" + months + "-" + days;
    }
  } else if (months == 04 || months == 06 || months == 09 || months == 11) {
    //Months with 30 days
    if (days + 1 > 30) {
      if (months + 1 > 12) {
        years += 1;
        return years + "-01-" + "01";
      } else {
        months += 1;
        return years + "-" + months + "-01";
      }
    } else {
      days += 1;
      return years + "-" + months + "-" + days;
    }
  } else if (months == 02) {
    if (years % 4 == 0) {
      //February - 29 Days
      if (days + 1 > 29) {
        return years + "-03-01";
      } else {
        days += 1;
        return years + "-02-" + days;
      }
    } else {
      //February - 28 Days
      if (days + 1 > 28) {
        return years + "-03-01";
      } else {
        days += 1;
        return years + "-02-" + days;
      }
    }
  } else {
    let today = new Date().toISOString().slice(0, 10);
    return today;
  }
}

function initalLoad() {
  return [
    {
      FileID: "\xa0",
      FileName: "\xa0",
      FilePath: "\xa0",
      FileExt: "\xa0",
      CompName: "\xa0",
      FileCreator: "\xa0",
      FileCreated: "\xa0",
      FileModified: "\xa0",
      FileSize: "\xa0",
    },
  ];
}

var specialOutput;
async function ScanningPageSearch(FileName, FilePath, FileExt, CompName, FileCreator, FileCreated, FileModified, FileSize) {
  try {
    specialOutput = [
      {
        FileID: "",
        FileName: "",
        FilePath: "",
        FileExt: "",
        CompName: "",
        FileCreator: "",
        FileCreated: "",
        FileModified: "",
        FileSize: "",
      },
    ];

    let vFileCreated = CheckEmptyTime(FileCreated);
    let vFileModified = CheckEmptyTime(FileModified);
    let vFileCreatedMax = CreateTimeRange(vFileCreated);
    let vFileModifiedMax = CreateTimeRange(vFileModified);

    let pool = await sql.connect(config);
    let recentFoundFiles = await pool
      .request()
      .input("FileName", sql.NVarChar, CheckEmptyInput(FileName))
      .input("FilePath", sql.NVarChar, CheckEmptyInput(FilePath))
      .input("FileExt", sql.NVarChar, CheckEmptyInput(FileExt))
      .input("CompName", sql.NVarChar, CheckEmptyInput(CompName))
      .input("FileCreator", sql.NVarChar, CheckEmptyInput(FileCreator))
      .input("FileCreated", sql.NVarChar, vFileCreated)
      .input("FileCreatedMax", sql.NVarChar, vFileCreatedMax)
      .input("FileModified", sql.NVarChar, vFileModified)
      .input("FileModifiedMax", sql.NVarChar, vFileModifiedMax)
      .input("FileSize", sql.NVarChar, CheckEmptyInput(FileSize))
      .execute("ScanningPageSearch");
    let iterator = 0;
    recentFoundFiles.recordset.forEach(function (row) {
      specialOutput[iterator] = { ...row };
      specialOutput[iterator].FileCreated = formatTime(specialOutput[iterator].FileCreated);
      specialOutput[iterator].FileModified = formatTime(specialOutput[iterator].FileModified);
      iterator++;
    });
    return specialOutput;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  ScanningPageSearch: ScanningPageSearch,
  initalLoad: initalLoad,
};
