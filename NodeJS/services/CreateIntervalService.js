const sql = require("mssql");
const config = require("./dbconfig");

function CheckName(input) {
    let reggie = new RegExp("^([0-9]{1,})$");
    if (reggie.test(input) == false) {
      return "ThisFailedSoWeAreSupplyingThisValue";
    }else{
      return input;
    }
}

async function AddInterval(InterName) {
    InterName = CheckName(InterName);
    if(InterName != "ThisFailedSoWeAreSupplyingThisValue"){
      let pool = await sql.connect(config);
      await pool.request()
        .input("InterName", sql.NVarChar, InterName)
        .execute("AddIntervals");
    }
  }
module.exports = {
    AddInterval: AddInterval,
}