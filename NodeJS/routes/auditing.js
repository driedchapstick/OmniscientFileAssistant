const express = require("express");
const { Connection } = require("tedious");
const auditingService = require("../services/AuditingService");
const router = express.Router();

module.exports = () => {
  router.get("/", function (req, res) {
    res.render("auditing", { data: auditingService.initalLoad() });
  });

  router.use(express.urlencoded({ extended: true }));

  router.post("/", function (req, res) {
    console.log("===============");
    console.log("IVE BEEN POSTED");
    console.log("===============");
    console.log("");
    auditingService.searchForMiiFiles(req.body.filter_field).then((result) => {
      res.render("auditing", { data: result });
    });
  });
  return router;
};
