const express = require("express");
const { Connection } = require("tedious");
const AuditingService = require("../services/AuditingService");
const router = express.Router();

module.exports = () => {
  router.use(express.urlencoded({ extended: true }));

  router.get("/", function (req, res) {
    AuditingService.GetAllAuditFiles().then((result) =>{
      res.render("Auditing", {audit: result});
    });
  });

  router.get("/:subpage", function (req, res){
    AuditingService.GetAuditData(req.params.subpage).then((result) =>{
      res.render("ChildAudits", {data: result[0], hist: result[1]});
    });
  });

  router.post("/:subpage", function (req, res) {
    res.download(`C:\\Users\\OmniFileAsAdmin\\Desktop\\LocalStorage\\${req.body.AuditName}\\${req.body.FileOnServer}`);
  });
  return router;
};
