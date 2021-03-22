const express = require("express");

const dashboardService = require("../services/DashboardService");
const scanningRoute = require("./scanning");
const patternsRoute = require("./patterns");
const auditingRoute = require("./auditing");
const createNewAuditRoute = require("./createNewAudit");
const createNewPatternRoute = require("./createNewPattern");
const modifyAuditRoute = require("./modifyAudit");
const scheduleConfigRoute = require("./ScheduleConfig");
const ModifyPatternRoute = require("./ModifyPattern");
const ModifyTermRoute = require("./ModifyTerm");
const createNewTermRoute = require("./createNewTerm");
const individualTermRoute = require("./individualTerm");
const deletePatternRoute = require("./deletePattern");
const deleteTermRoute = require("./deleteTerm");
const deleteAuditRoute = require("./deleteAudit");
const auditDashRoute = require("./auditDash");
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
  router.use("/createNewAudit", createNewAuditRoute());
  router.use("/createNewPattern", createNewPatternRoute());
  router.use("/modifyAudit", modifyAuditRoute());
  router.use("/ScheduleConfig", scheduleConfigRoute());
  router.use("/ModifyPatterns", ModifyPatternRoute());
  router.use("/ModifyTerms", ModifyTermRoute());
  router.use("/createNewTerm", createNewTermRoute());
  router.use("/individualTerm", individualTermRoute());
  router.use("/deletePattern", deletePatternRoute());
  router.use("/deleteTerm", deleteTermRoute());
  router.use("/deleteAudit", deleteAuditRoute());
  router.use("/auditDash", auditDashRoute());
  return router;
};
