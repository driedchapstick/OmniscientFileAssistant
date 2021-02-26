const express = require("express");
const { Connection } = require("tedious");
const deletePatternService = require("../services/deletePatternService");
const router = express.Router();

module.exports = () => {
  router.get("/", function (req, res) {
    res.render("deletePattern", { data: deletePatternService.initalLoad() });
  });

  router.use(express.urlencoded({ extended: true }));

  router.post("/", function (req, res) {
    console.log("===============");
    console.log("IVE BEEN POSTED");
    console.log("===============");
    console.log("");
    deletePatternService
      .searchForMiiFiles(req.body.filter_field)
      .then((result) => {
        res.render("deletePattern", { data: result });
      });
  });
  return router;
};
