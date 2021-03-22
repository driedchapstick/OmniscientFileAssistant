const express = require("express");
const { Connection } = require("tedious");
const DeleteAuditService = require("../services/DeleteAuditService");
const router = express.Router();

module.exports = () => {
  router.use(express.urlencoded({ extended: true }));

  router.get("/", function (req, res) {
    DeleteAuditService.InitialLoad().then((result)=>{
      res.render("DeleteAudit", { audits: result, ConfirmString: "\xa0" });
    });
  });

  router.post("/", function (req, res){
    DeleteAuditService.DeleteAudit(req.body.AuditID).then((result) => {
      res.render("DeleteAudit", {audits: result[0], ConfirmString: result[1]});
    });
  });

  return router;
};
