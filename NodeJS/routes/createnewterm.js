const express = require("express");
const { Connection } = require("tedious");
const CreateNewTermService = require("../services/CreateNewTermService.js");
const router = express.Router();

module.exports = () => {
  router.use(express.urlencoded({ extended: true }));

  router.get("/", function(req, res){
    CreateNewTermService.InitialLoad("").then((result) => {
      res.render("CreateNewTerm", { TermData: result[0], AllTypes: result[1], ConfirmString: result[2] });
    });
  });
  router.post("/", function(req, res){
    CreateNewTermService.AddTerm(req.body.TermType, req.body.TermName, req.body.TermValue, "SUCCESS: Term added to the databse.").then((result) => {
      res.render("CreateNewTerm", { TermData: result[0], AllTypes: result[1], ConfirmString: result[2] },)
    })
  });
  return router;
};
