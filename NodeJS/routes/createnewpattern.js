const express = require("express");
const { Connection } = require("tedious");
const createNewPatternService = require("../services/CreateNewPatternService.js");
const router = express.Router();

module.exports = () => {
  router.get("/", function (req, res) {
    createNewPatternService.getTerms().then((result) => {
      res.render("createnewpattern", { data: result });
    });
  });

  router.use(express.urlencoded({ extended: true }));

  router.post("/", function (req, res) {
    //Re-renders the page
    createNewPatternService.getTerms().then((result) => {
      res.render("createnewpattern", { data: result });
    });
    //Creates the Match Criteria
    createNewPatternService
      .addMatchCriteria(req.body.name_field, req.body.backupName)
      .then((result) => {
        let newMatchCriteriaID = result;
        console.log(newMatchCriteriaID);
        console.log("newCriteria");
        //Create the Criteria Terms link
        createNewPatternService
          .addCriteriaTerms(newMatchCriteriaID, req.body.terms)
          .then((results) => {
            console.log("new terms linked");
          });
      });
  });

  router.post("/");
  return router;
};
