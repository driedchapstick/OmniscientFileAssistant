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
        console.log("New MatchCriteria was made with an ID of " + result + ".");
        //Create the Criteria Terms link
        createNewPatternService
          .addCriteriaTerms(result, req.body.terms)
          .then((results) => {
            console.log(
              "The Terms below were associated with a MatchCriteria ID of " +
                result +
                "."
            );
            console.log(req.body.terms);
          });
      });
  });

  router.post("/");
  return router;
};
