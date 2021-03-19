const express = require("express");

const dashboardService = require("../services/DashboardService");
const scanningRoute = require("./scanning");
const patternsRoute = require("./patterns");
const auditingRoute = require("./auditing");
const createNewAuditRoute = require("./createNewAudit");
const createNewPatternRoute = require("./createNewPattern");
const modifyAuditRoute = require("./ModifyAudit");
const scheduleConfigRoute = require("./ScheduleConfig");
const ModifyPatternRoute = require("./ModifyPattern");
const ModifyTermRoute = require("./ModifyTerm");
const ModifyAuditRoute = require("./ModifyAudit");
const DeletePatternRoute = require("./DeletePattern");
const DeleteTermRoute = require("./DeleteTerm");
const DeleteAuditRoute = require("./DeleteAudit");

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
  router.use("/DeletePatterns", DeletePatternRoute());
  router.use("/DeleteTerms", DeleteTermRoute());
  router.use("/DeleteAudits", DeleteAuditRoute());
  router.use("/ModifyAudits", ModifyAuditRoute());
  return router;
};
