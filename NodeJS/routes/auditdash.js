const express = require("express");
const { Connection } = require("tedious");
const scheduleConfigService = require("../services/AuditDashService");
const IndiComp = require("./IndiComp");
const IndiSched = require("./IndiSched");
const CreateSched = require("./CreateSchedule");
const DeleteSched = require("./DeleteSchedule");
const CreateInterval = require("./CreateInterval");
const DeleteInterval = require("./DeleteInterval");
const router = express.Router();

module.exports = () => {
  router.get("/", function (req, res) {
    let compsTable;
    let compsNotTable;
    let schedsTable;
    scheduleConfigService.getCompsTable().then((compsResult) => {
      compsTable = compsResult;
      scheduleConfigService.getNotCompsTable().then((compsNotResult) => {
        compsNotTable = compsNotResult;
        scheduleConfigService.getSchedsTable().then((schedsResult) => {
          schedsTable = schedsResult;
          res.render("ScheduleConfig", {
            comps: compsTable,
            compsNot: compsNotTable,
            scheds: schedsTable,
          });
        });
      });
    });
  });
  router.use("/IndividualComp", IndiComp());
  router.use("/IndividualSchedule", IndiSched());
  router.use("/CreateSchedule", CreateSched());
  router.use("/DeleteSchedule", DeleteSched());
  router.use("/CreateInterval", CreateInterval());
  router.use("/DeleteInterval", DeleteInterval());
  return router;
};
