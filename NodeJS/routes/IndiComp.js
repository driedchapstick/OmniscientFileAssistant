const express = require("express");
const { Connection } = require("tedious");
const indiCompService = require("../services/IndiCompService");
const router = express.Router();

module.exports = () => {
  router.use(express.urlencoded({ extended: true }));

  router.get("/:subpage", function (req, res) {
    let currentSched;
    indiCompService.getCurSched(req.params.subpage).then((result) => {
      currentSched = result;
      indiCompService.getSchedsTable().then((schedsResult) => {
        res.render("IndiComp", { scheds: schedsResult, curSched: currentSched });
      });
    });
  });

  router.post("/:subpage", function (req, res) {
    indiCompService.addCompSchedules(req.params.subpage, req.body.schedsID).then(() => {
      let currentSched;
      indiCompService.getCurSched(req.params.subpage).then((result) => {
        currentSched = result;
        indiCompService.getSchedsTable().then((schedsResult) => {
          res.render("IndiComp", { scheds: schedsResult, curSched: currentSched });
        });
      });
    });
  });
  return router;
};
