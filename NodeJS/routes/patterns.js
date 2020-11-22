const express = require("express");
const { Connection } = require("tedious");
const patternService = require("../services/PatternService");
const router = express.Router();

module.exports = () => {
  router.get("/", function (req, res) {
    patternService.getRecentFoundFiles().then((result) => {
      res.render("scanning", { data: result });
    });
  });

  router.get("/:subpage", function (req, res) {
    return res.render("patterns", {
      randomString: "This is the Scanning Subpage.",
    });
  });

  //Got to 4:20 on LinkedIn Learning course for subpath routing (Section 3 Episode 3)

  return router;
};
