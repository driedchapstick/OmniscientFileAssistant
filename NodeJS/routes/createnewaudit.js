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
    console.log("===============");
    console.log("IVE BEEN POSTED");
    console.log("===============");
    console.log("");
    createNewAuditService
      .searchForMiiFiles(req.body.filter_field)
      .then((result) => {
        res.render("createNewAudit", { data: result });
      });
  });
  return router;
};
