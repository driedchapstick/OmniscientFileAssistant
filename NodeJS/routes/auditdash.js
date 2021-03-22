const express = require("express");
const { Connection } = require("tedious");
const auditDashService = require("../services/AuditDashService");
const router = express.Router();

module.exports = () => {
  router.get("/", function (req, res) {
    res.render("auditdash", { data: auditDashService.initalLoad() });
  });

  router.use(express.urlencoded({ extended: true }));

  router.post("/", function (req, res) {
    console.log("===============");
    console.log("IVE BEEN POSTED");
    console.log("===============");
    console.log("");
    auditDashService.searchForMiiFiles(req.body.filter_field).then((result) => {
      res.render("auditdash", { data: result });
    });
  });
  return router;
};
