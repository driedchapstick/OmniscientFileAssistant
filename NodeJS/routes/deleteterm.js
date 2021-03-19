const express = require("express");
const { Connection } = require("tedious");
const DeleteTermService = require("../services/deleteTermService");
const router = express.Router();

module.exports = () => {
  router.use(express.urlencoded({ extended: true }));

  router.get("/", function (req, res) {
    DeleteTermService.InitialLoad().then((result)=>{
      res.render("DeleteTerm", { terms: result, ConfirmString: "\xa0" });
    });
  });

  router.post("/", function (req, res){
    DeleteTermService.DeleteTerm(req.body.TermID).then((result) => {
      res.render("DeleteTerm", {terms: result[0], ConfirmString: result[1]});
    });
  });
  
  
  return router;
};
