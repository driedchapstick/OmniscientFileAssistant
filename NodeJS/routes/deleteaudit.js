const express = require("express");
const { Connection } = require("tedious");
const deleteAuditService = require("../services/deleteAuditService");
const router = express.Router();

module.exports = () => {
  router.get("/", function (req, res) {
    res.render("deleteAudit", { data: deleteAuditService.initalLoad() });
  });

  router.use(express.urlencoded({ extended: true }));

  router.post("/", function (req, res) {
    console.log("===============");
    console.log("IVE BEEN POSTED");
    console.log("===============");
    console.log("");
    deleteAuditService
      .searchForMiiFiles(req.body.filter_field)
      .then((result) => {
        res.render("deleteAudit", { data: result });
      });
  });
  return router;
};
