const express = require("express");
const { Connection } = require("tedious");
const patternService = require("../services/PatternService");
const router = express.Router();

module.exports = () => {
  router.get("/", function (req, res) {
    patternService.getPatternsTable().then((result) => {
      res.render("patterns", { data: result });
    });
  });

  router.get("/:subpage", function (req, res) {
    return res.send(
      `This is for the Specific Pattern/Criteria named ${req.params.subpage}`
    );
  });

  //Got to 4:20 on LinkedIn Learning course for subpath routing (Section 3 Episode 3)

  return router;
};
