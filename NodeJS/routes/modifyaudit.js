const express = require("express");
const { Connection } = require("tedious");
const modifyAuditService = require("../services/modifyAuditService");
const router = express.Router();

module.exports = () => {
  router.get("/", function (req, res) {
    res.render("modifyAudit", { data: modifyAuditService.initalLoad() });
  });

  router.use(express.urlencoded({ extended: true }));

  router.post("/", function (req, res) {
    console.log("===============");
    console.log("IVE BEEN POSTED");
    console.log("===============");
    console.log("");
    createNewAuditService
      .searchForMiiFiles(req.body.filter_field)
      .then((result) => {
        res.render("modifyAudit", { data: result });
      });
  });
  return router;
};
