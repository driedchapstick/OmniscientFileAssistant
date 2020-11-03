// https://www.youtube.com/watch?v=Uvy_BlgwfLI
// Time: 8:11 - 12:07
// The connection configuration needed to connect to the SQL server.

const config = {
  user: "",
  password: "",
  server: "omnifileasdbs.database.windows.net",
  database: "OmniFileAsDB",
  options: {
    encrypt: true,
  },
};

module.exports = config;
