const express = require("express");
const { Connection } = require("tedious");
const scanningService = require("../services/ScanningService");
const router = express.Router();

module.exports = () => {
  router.get("/", function (req, res) {
    scanningService.getRecentFoundFiles().then((result) => {
      res.render("scanning", { data: result });
    });
  });

  router.get("/:subpage", function (req, res) {
    return res.render("scanning", {
      randomString: "This is the Scanning Subpage.",
    });
  });

  //Got to 4:20 on LinkedIn Learning course for subpath routing (Section 3 Episode 3)

  return router;
};
