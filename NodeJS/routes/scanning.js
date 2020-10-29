const express = require("express");

const router = express.Router();

module.exports = () => {
  router.get("/", function (req, res) {
    res.render("scanning", { randomString: "This is the Scanning Page." });
  });

  router.get("/:subpage", function (req, res) {
    res.render("scanning", { randomString: "This is the Scanning Subpage." });
  });

  //Got to 4:20 on LinkedIn Learning course for subpath routing (Section 3 Episode 3)

  return router;
};
