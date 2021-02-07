const express = require("express");
const {Connection} = require("tedious");
const ScheduleConfigService = require("../services/ScheduleConfigService");
const scheduleConfigService = require("../services/ScheduleConfigService");
const router = express.Router();

module.exports = () => {
  router.get("/", function (req, res) {
    let compsTable;
    let compsNotTable;
    let schedsTable;
    scheduleConfigService.getCompsTable().then((compsResult) => {
      compsTable = compsResult;
      ScheduleConfigService.getNotCompsTable().then((compsNotResult) => {
        compsNotTable = compsNotResult;
        scheduleConfigService.getSchedsTable().then((schedsResult) => {
          schedsTable = schedsResult;
          res.render("ScheduleConfig", {comps: compsTable, compsNot: compsNotTable, scheds: schedsTable});
        });
      });
    });
  });

  return router;
};
