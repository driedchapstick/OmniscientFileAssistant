const express = require("express");
const { Connection } = require("tedious");
const router = express.Router();

module.exports = () => {
  router.get("/:subpage", function (req, res) {
    console.log("suck on this");
    res.render("IndiComp");
  });
  return router;
};
