const express = require("express");
const { Connection } = require("tedious");
const modifyPatternService = require("../services/modifyPatternService");
const router = express.Router();

module.exports = () => {
  router.get("/", function (req, res) {
    res.render("modifyPattern", { data: modifyPatternService.initalLoad() });
  });

  router.use(express.urlencoded({ extended: true }));

  router.post("/", function (req, res) {
    console.log("===============");
    console.log("IVE BEEN POSTED");
    console.log("===============");
    console.log("");
    modifyPatternService
      .searchForMiiFiles(req.body.filter_field)
      .then((result) => {
        res.render("modifyPattern", { data: result });
      });
  });
  return router;
};
