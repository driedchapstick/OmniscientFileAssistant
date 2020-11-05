/*
https://www.youtube.com/watch?v=Uvy_BlgwfLI

Time: 13:16 - 16:47 (He restates the purpose of this file until 17:26.)
Creating a statement that queries database via SELECT statement.
Cross reference with this -> https://www.npmjs.com/package/mssql#query-command-callback

Time: 27:48 - 30:07
Creating slightly more advanced query that accepts params. (Testing: 30:08 - 31:24)
Cross reference with this -> https://www.npmjs.com/package/mssql#query-command-callback

Time: 31:25 - 33:10
Creating a statement adds data to the database via stored procedure. 
Cross reference with this -> https://www.npmjs.com/package/mssql#execute-procedure-callback

Time: 33:11 - 35:18
Adding route to API for insert operation. (Destructuring data from post request: 34:00 - 34:23)

Time: 34:24 - 37:07
Testing the insert operation. (Him explaining everything again: 37:08 - 38:14)
*/

const config = require("./dbconfig");
const sql = require("mssql");

// async is required when using await keyword (line 11).
async function getFoundFiles() {
  try {
    // connect() is aysnchronous --> await is needed.
    let pool = await sql.connect(config);
    let foundFiles = await pool.request().execute("GetAllFoundFiles");
    return foundFiles.recordsets;
  } catch (error) {
    console.log("------------------------------------------------");
    console.log("This is an error with the connection or request.");
    console.log("------------------------------------------------");
    console.log(error);
  }
}

//He forgot to include the module export. Comes back to add it at 18:14 - 18:38)
module.exports = {
  getFoundFiles: getFoundFiles,
};
