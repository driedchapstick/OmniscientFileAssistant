const { Connection, Request } = require("tedious");
var queryOutput;
// Create connection to database
const config = {
  authentication: {
    options: {
      userName: "OmniFileAsDBA", // update me
      password: "Weseeyourfiles2!", // update me
    },
    type: "default",
  },
  server: "omnifileasdbs.database.windows.net", // update me
  options: {
    database: "OmniFileAsDB", //update me
    encrypt: true,
  },
};

const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on("connect", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    queryDatabase();
  }
});

function queryDatabase() {
  console.log("Reading rows from the Table...");

  // Read all rows from table
  const request = new Request(
    `SELECT TOP 2 * FROM FoundFiles`,
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );

  request.on("row", (columns) => {
    columns.forEach((column) => {
      //console.log("%s\t%s", column.metadata.colName, column.value);
      queryOutput += column.metadata.colName + column.value + "";
    });
  });

  connection.execSql(request);
  console.log(queryOutput);
  console.log("poop");
}
