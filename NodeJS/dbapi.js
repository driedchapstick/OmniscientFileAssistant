/*
https://www.youtube.com/watch?v=Uvy_BlgwfLI

Time: 17:27 - 19:16
Creating code to call the database operations

Time: 19:15 - 19:34
Running the first test of the JavaScript. (He re-explains everything: 19:35 - 19:54)

^^^ I stopped following along (adding code) after the section above. ^^^

Time: 19:55 - 21:47
Creating API ontop of existing code. (He re-explains everything: 21:48 - 22:00)

Time: 22:07 - 24:48
Creating Middleware to listen for request and then call API.

Time: 25:07 - 26:25
Testing the API.

Time: 26:35 - 27:48
Him explaining EVERYTHING so far.

Time: 27:19 - 27:30
The middleware where you would configure authentication. (Lines 17 - 20)
*/

const dbOperations = require("./dboperations");
var foundFile = require("./dbclasses");
const fs = require("fs");

// Returns a promise --> then() (18:50)
dbOperations.getFoundFiles().then((result) => {
  console.log(result);
  /*fs.writeFile("Result Set in a File.txt", JSON.stringify(result), (err) => {
    if (err) return console.log(err);
  });*/
});
