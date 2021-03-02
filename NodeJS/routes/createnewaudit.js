const express = require("express");
const { Connection } = require("tedious");
const createNewAuditService = require("../services/createNewAuditService");
const router = express.Router();

module.exports = () => {
  router.get("/", function (req, res) {
    res.render("createNewAudit", { data: createNewAuditService.initalLoad() });
  });

  router.use(express.urlencoded({ extended: true }));

  router.post("/", function (req, res) {
    createNewAuditService
      .searchForMiiFiles(req.body.filter_field)
      .then((result) => {
        res.render("createNewAudit", { data: result });
      });
  });
  router.post("/NewAudit", function (req, res) {
    createNewAuditService.addAuditFile(req.body.name_audit, req.body.option);
    res.redirect("/createnewaudit");

    console.log(req.body.option);
    console.log(req.body.name_audit);
  });
  return router;
};
