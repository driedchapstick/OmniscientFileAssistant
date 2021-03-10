const express = require("express");
const { Connection } = require("tedious");
const ModifyTermService = require("../services/ModifyTermService.js");
const router = express.Router();

module.exports = () => {
  router.use(express.urlencoded({ extended: true }));

  router.get("/", function (req, res) {
    ModifyTermService.GetAllTerms().then((result)=> {
      res.render("ModifyTerm", { data: result});
    });
  });
  router.get("/:subpage", function(req, res){
    ModifyTermService.GetCurTermOptions(req.params.subpage, "").then((result) => {
      res.render("IndiTerm", { TermData: result[0], AllTypes: result[1], SpecificType: result[2], ConfirmString: result[3] },)
    });
  });
  router.post("/:subpage", function(req, res){
    ModifyTermService.UpdateTheTerm(req.params.subpage, req.body.TermType, req.body.TermName, req.body.TermValue).then((result) => {
      res.render("IndiTerm", { TermData: result[0], AllTypes: result[1], SpecificType: result[2], ConfirmString: result[3] },)
    })
  });
  return router;
};
