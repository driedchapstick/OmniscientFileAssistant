const express = require("express");

const dashboardService = require("../services/DashboardService");
const scanningRoute = require("./scanning");
const patternsRoute = require("./patterns");
const auditingRoute = require("./auditing");

const router = express.Router();

module.exports = () => {
  router.get("/", function (req, res) {
    dashboardService.getRecentFoundFiles().then((result) => {
      res.render("dashboard", { data: result });
    });
  });

  router.use("/scanning", scanningRoute());
  router.use("/patterns", patternsRoute());
  router.use("/auditing", auditingRoute());

  return router;
};
