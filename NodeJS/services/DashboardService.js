const config = require("./dbconfig");
const sql = require("mssql");
var blankRecent = [
  {
    FileID: "ERROR",
    FileName: "ERROR",
    FilePath: "ERROR",
    FileExt: "ERROR",
    CompName: "ERROR",
    FileCreator: "ERROR",
    FileCreated: "ERROR",
    FileModified: "ERROR",
    FileSize: "ERROR",
  },
];

function formatTime(theTime) {
  theTime = theTime.toString();

  dayOf = theTime.indexOf(" ") + 1;
  theTime = theTime.substring(dayOf);

  zoneName = theTime.indexOf("(") - 1;
  theTime = theTime.substring(0, zoneName);

  zoneID = theTime.lastIndexOf(" ");
  theTime = theTime.substring(0, zoneID);

  return theTime;
}
// Will be called recursively to cut a string (of any length) into lengths of 10.
function parseInto10(oldString, newString) {
  indexOfSlash = oldString.indexOf("\\");
  indexOfSpace = oldString.indexOf(" ");

  if (indexOfSlash > -1 && indexOfSpace > -1 && indexOfSlash < indexOfSpace) {
    indexBR = indexOfSlash;
  } else if (
    indexOfSlash > -1 &&
    indexOfSpace > -1 &&
    indexOfSlash > indexOfSpace
  ) {
    indexBR = indexOfSpace;
  } else if (
    indexOfSlash > -1 ||
    (indexOfSpace > -1 && indexOfSlash > indexOfSpace)
  ) {
    indexBR = indexOfSlash;
  } else if (
    indexOfSlash > -1 ||
    (indexOfSpace > -1 && indexOfSlash < indexOfSpace)
  ) {
    indexBR = indexOfSpace;
  } else {
    indexBR = -1;
  }
  if (indexBR > 0 && indexBR < 10) {
    firstPart = oldString.substring(0, indexBR + 1);
    secondPart = oldString.substring(indexBR + 1);
  } else {
    firstPart = oldString.substring(0, 10);
    secondPart = oldString.substring(10);
  }
  indexOfDash = firstPart.lastIndexOf("-");
  if (indexOfDash == 7 || indexOfDash == 8 || indexOfDash == 9) {
    secondPart = firstPart.substring(indexOfDash + 1) + secondPart;
    firstPart = firstPart.substring(0, indexOfDash + 1);
  }
  secondLength = secondPart.length;
  if (secondLength <= 10) {
    return (newString += firstPart + " " + secondPart);
  } else {
    newString += firstPart + " ";
    return parseInto10(secondPart, newString);
  }
}

// Since we aren't the best at Web Design, the tabl column widths are fixed.
// This function will create a line break in the data to make it compatible with the width.
function formatData(oldData, newData) {
  oldData.toString();
  lengthOfData = oldData.length;

  if (lengthOfData <= 10) {
    return oldData;
  } else {
    return parseInto10(oldData, newData);
  }
}

async function getRecentFoundFiles() {
  try {
    let pool = await sql.connect(config);
    let recentFoundFiles = await pool
      .request()
      .input("ColNum", sql.Int, 10)
      .execute("GetTopFF");
    let iterator = 0;
    recentFoundFiles.recordset.forEach(function (row) {
      blankRecent[iterator] = { ...row };
      blankRecent[iterator].FileName = formatData(
        blankRecent[iterator].FileName,
        ""
      );
      blankRecent[iterator].FilePath = formatData(
        blankRecent[iterator].FilePath,
        ""
      );
      blankRecent[iterator].FileExt = formatData(
        blankRecent[iterator].FileExt,
        ""
      );
      blankRecent[iterator].CompName = formatData(
        blankRecent[iterator].CompName,
        ""
      );
      blankRecent[iterator].FileCreator = formatData(
        blankRecent[iterator].FileCreator,
        ""
      );
      blankRecent[iterator].FileCreated = formatTime(
        blankRecent[iterator].FileCreated
      );
      blankRecent[iterator].FileModified = formatTime(
        blankRecent[iterator].FileModified
      );
      blankRecent[iterator].FileSize = formatData(
        blankRecent[iterator].FileSize,
        ""
      );
      iterator++;
    });
    //console.log(blankRecent);
    return blankRecent;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getRecentFoundFiles: getRecentFoundFiles,
};
