const express = require("express");
const { Connection } = require("tedious");
const scheduleConfigService = require("../services/ScheduleConfigService");
const indiComp = require("./IndiComp");
const indiSched = require("./IndiSched");
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
          res.render("ScheduleConfig", { comps: compsTable, compsNot: compsNotTable, scheds: schedsTable });
        });
      });
    });
  });
  router.use("/IndividualComp", indiComp());
  router.use("/IndividualSchedule", indiSched());
  return router;
};
