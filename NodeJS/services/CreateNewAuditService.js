const sql = require("mssql");
const config = require("./dbconfig");

function initalLoad() {
  return [
          [
            {
              FileID: "void",
              FileName: "\xa0",
              FilePath: "\xa0",
              FileExt: "\xa0",
              CompName: "\xa0",
              FileCreator: "\xa0",
              FileCreated: "\xa0",
              FileModified: "\xa0",
              FileSize: "\xa0",
            },
          ],
          [
            { 
              FileName: "",
              FilePath: "",
              FileExt: "",
              CompName: "",
              FileCreator: "",
              FileCreated: "",
              FileModified: "",
              FileSize: "",
            },
          ],
        ];
}

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

async function ScanningPageSearch(FileNameIN, FilePathIN, FileExtIN, CompNameIN, FileCreatorIN, FileCreatedIN, FileModifiedIN, FileSizeIN) {
  
  try {
    let specialOutput = [
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

    let vFileCreated = CheckEmptyTime(FileCreatedIN);
    let vFileModified = CheckEmptyTime(FileModifiedIN);
    let vFileCreatedMax = CreateTimeRange(vFileCreated);
    let vFileModifiedMax = CreateTimeRange(vFileModified);

    let pool = await sql.connect(config);
    let recentFoundFiles = await pool
      .request()
      .input("FileName", sql.NVarChar, CheckEmptyInput(FileNameIN))
      .input("FilePath", sql.NVarChar, CheckEmptyInput(FilePathIN))
      .input("FileExt", sql.NVarChar, CheckEmptyInput(FileExtIN))
      .input("CompName", sql.NVarChar, CheckEmptyInput(CompNameIN))
      .input("FileCreator", sql.NVarChar, CheckEmptyInput(FileCreatorIN))
      .input("FileCreated", sql.NVarChar, vFileCreated)
      .input("FileCreatedMax", sql.NVarChar, vFileCreatedMax)
      .input("FileModified", sql.NVarChar, vFileModified)
      .input("FileModifiedMax", sql.NVarChar, vFileModifiedMax)
      .input("FileSize", sql.NVarChar, CheckEmptyInput(FileSizeIN))
      .execute("ScanningPageSearch");
    let iterator = 0;
    recentFoundFiles.recordset.forEach(function (row) {
      specialOutput[iterator] = { ...row };
      specialOutput[iterator].FileCreated = formatTime(specialOutput[iterator].FileCreated);
      specialOutput[iterator].FileModified = formatTime(specialOutput[iterator].FileModified);
      iterator++;
    });
    return [specialOutput, [{FileName: FileNameIN, FilePath: FilePathIN, FileExt: FileExtIN, CompName: CompNameIN, FileCreator: FileCreatorIN, FileCreated: FileCreatedIN, FileModified: FileModifiedIN, FileSize: FileSizeIN}] , "SUCCESS: Search Complete"];
  } catch (error) {
    console.log(error);
    return [initalLoad(), "Search Failed"];
  }
}

async function AddAuditFile(FileID, AuditName) {
  try{
    let pool = await sql.connect(config);
    let AddedAudits = await pool
      .request()
      .input("AuditName", sql.NVarChar, AuditName)
      .input("FileID", sql.Int, FileID)
      .execute("AddAuditFiles");
  }catch(error){
    console.log(error);
  }
}

function CheckID(input) {
  let reggie = new RegExp("^([0-9]{1,})$");
  if (reggie.test(input) == false) {
    return 0;
  }else{
    return input;
  }
}

function CheckAuditName(input) {
  let reggie = new RegExp("^([a-zA-Z0-9_\\-\\.\\/\\\ ]{1,100})$");
  if (reggie.test(input) == false) {
    return 0;
  }else{
    return input;
  }
}

function CheckSearchFields(SearchFieldsIN){
  //If at least 1 input field has a length greater than 0 then the user put something in the field. 
  let AnythingThere = 0;
  SearchFieldsIN.forEach(function (field){
    console.log(field);
    if(field.length > 0){ AnythingThere = 1;}
  })
  console.log(AnythingThere);
  return AnythingThere;
}

function CheckSubmitFields(SubmitFieldsIN){
  //If either of the fields does not have a value, the user did not fill out all the fields. 
  if(CheckID(SubmitFieldsIN[0]) == 0 || CheckAuditName(SubmitFieldsIN[1]) == 0){
    return 0;
  }else{
    return 1;
  }
}

function DeterminePost(SearchFieldsIN, SubmitFieldsIN, Button){
  //Checks to see what button was pressed on the page. 
  if(Button == "Search"){
    //Check to make sure there is input in at least one of the fields before performing the search.
    if(CheckSearchFields(SearchFieldsIN) == 1){
      return "Good Search";
    }else{
      return "Empty Search";
    }
  }else if(Button == "Submit"){
    //Check to make sure there is both a FileID and an AuditName. 
    if(CheckSubmitFields(SubmitFieldsIN) == 1){
      return "Good Submit";
    }else{
      return "Empty Submit";
    }
  }else{
    return "FAILURE";
  }
}

module.exports = {
  initalLoad: initalLoad,
  DeterminePost: DeterminePost,
  ScanningPageSearch: ScanningPageSearch,
  AddAuditFile: AddAuditFile,
};
