const express = require("express");
const { Connection } = require("tedious");
const individualTermService = require("../services/individualTermService.js");
const router = express.Router();

module.exports = () => {
  router.get("/", function (req, res) {
    individualTermService.getTerms().then((result) => {
      res.render("individualterm", { data: result });
    });
  });

  router.use(express.urlencoded({ extended: true }));

  router.post("/", function (req, res) {
    //Re-renders the page
    individualTermService.getTerms().then((result) => {
      res.render("individualterm", { data: result });
    });
    //Creates the Match Criteria
    individualTermService
      .addMatchCriteria(req.body.name_field, req.body.backupName)
      .then((result) => {
        console.log("New MatchCriteria was made with an ID of " + result + ".");
        //Create the Criteria Terms link
        individualTermService
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
