const config = require("./dbconfig");
const sql = require("mssql");
var blankRecent = [
  {
    id: "",
    name: "",
    loc: "",
    ext: "",
    comp: "",
    own: "",
    cre: "",
    mod: "",
    size: "",
  },
  {
    id: "",
    name: "",
    loc: "",
    ext: "",
    comp: "",
    own: "",
    cre: "",
    mod: "",
    size: "",
  },
  {
    id: "",
    name: "",
    loc: "",
    ext: "",
    comp: "",
    own: "",
    cre: "",
    mod: "",
    size: "",
  },
  {
    id: "",
    name: "",
    loc: "",
    ext: "",
    comp: "",
    own: "",
    cre: "",
    mod: "",
    size: "",
  },
  {
    id: "",
    name: "",
    loc: "",
    ext: "",
    comp: "",
    own: "",
    cre: "",
    mod: "",
    size: "",
  },
  {
    id: "",
    name: "",
    loc: "",
    ext: "",
    comp: "",
    own: "",
    cre: "",
    mod: "",
    size: "",
  },
  {
    id: "",
    name: "",
    loc: "",
    ext: "",
    comp: "",
    own: "",
    cre: "",
    mod: "",
    size: "",
  },
  {
    id: "",
    name: "",
    loc: "",
    ext: "",
    comp: "",
    own: "",
    cre: "",
    mod: "",
    size: "",
  },
  {
    id: "",
    name: "",
    loc: "",
    ext: "",
    comp: "",
    own: "",
    cre: "",
    mod: "",
    size: "",
  },
  {
    id: "",
    name: "",
    loc: "",
    ext: "",
    comp: "",
    own: "",
    cre: "",
    mod: "",
    size: "",
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

  console.log(theTime);
  return theTime;
}

async function getRecentFoundFiles() {
  try {
    let pool = await sql.connect(config);
    let recentFoundFiles = await pool.request().execute("GetAllFoundFiles");
    let iterator = 0;
    recentFoundFiles.recordset.forEach(function (row) {
      blankRecent[iterator] = { ...row };

      blankRecent[iterator].FileCreated = formatTime(
        blankRecent[iterator].FileCreated
      );
      blankRecent[iterator].FileModified = formatTime(
        blankRecent[iterator].FileModified
      );
      iterator++;
    });
    console.log(blankRecent);
    return blankRecent;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getRecentFoundFiles: getRecentFoundFiles,
};
