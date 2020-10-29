const express = require("express");

const scanningRoute = require("./scanning");
const patternsRoute = require("./patterns");
const auditingRoute = require("./auditing");

const router = express.Router();

module.exports = () => {
  router.get("/", function (req, res) {
    res.render("dashboard", { randomString: "This is the dashboard." });
  });

  router.use("/scanning", scanningRoute());
  router.use("/patterns", patternsRoute());
  router.use("/auditing", auditingRoute());

  return router;
};
