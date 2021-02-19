const express = require("express");
const { Connection } = require("tedious");
const IndiSchedService = require("../services/IndiSchedService");
const router = express.Router();

module.exports = () => {
  router.use(express.urlencoded({ extended: true }));

  router.get("/:subpage", function (req, res) {
    IndiSchedService.InitialLoad(req.params.subpage).then((result) => {
      res.render("IndiSched", { scheds: result[0], ints: result[1], comps: result[2] });
    });
  });
  router.post("/:subpage", function (req, res) {
    IndiSchedService.UpdateSchedule(req.params.subpage, req.body.SchedName, req.body.BaseTime, req.body.InterID);
    res.redirect("back");
  });
  return router;
};
