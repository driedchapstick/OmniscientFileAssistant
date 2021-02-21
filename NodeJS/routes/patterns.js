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
    patternService.getFlaggedFiles(req.params.subpage).then((result) => {
      res.render("childpatterns", { data: result });
    });
  });

  router.use(express.urlencoded({ extended: true }));

  router.post("/:subpage", function (req, res) {
    res.download(`C:\\Users\\OmniFileAsAdmin\\Desktop\\LocalStorage\\${req.params.subpage}\\DRIECHAPSTICKPC-${req.body.downloadB}`);
  });

  //Got to 4:20 on LinkedIn Learning course for subpath routing (Section 3 Episode 3)

  return router;
};
