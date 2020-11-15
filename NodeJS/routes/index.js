const express = require("express");

const dashboardService = require("../services/DashboardService");
const scanningRoute = require("./scanning");
const patternsRoute = require("./patterns");
const auditingRoute = require("./auditing");
const { response } = require("express");

const router = express.Router();

module.exports = () => {
  router.get("/", function (req, res) {
    let recentTable;
    let schedTable;
    dashboardService.getRecentFoundFiles().then((firResult) => {
      recentTable = firResult;

      dashboardService.getScheduleTableData().then((secResult) => {
        schedTable = secResult;
        res.render("dashboard", { data: recentTable, sched: schedTable });
      });
    });
  });

  router.use("/scanning", scanningRoute());
  router.use("/patterns", patternsRoute());
  router.use("/auditing", auditingRoute());

  return router;
};
