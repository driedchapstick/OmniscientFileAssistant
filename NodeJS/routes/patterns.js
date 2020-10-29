const express = require("express");

const router = express.Router();

module.exports = () => {
  router.get("/", function (req, res) {
    res.render("patterns", { randomString: "This is the Patterns Page." });
  });

  router.get("/:subpage", function (req, res) {
    return res.render("patterns", {
      randomString: "This is the Patterns Subpage.",
    });
  });

  //Got to 4:20 on LinkedIn Learning course for subpath routing (Section 3 Episode 3)

  return router;
};
