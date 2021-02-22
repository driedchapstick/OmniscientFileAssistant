const express = require("express");
const { Connection } = require("tedious");
const modifyTermService = require("../services/modifyTermService.js");
const router = express.Router();

module.exports = () => {
  router.get("/", function (req, res) {
    res.render("modifyTerm", {
      data: modifyTermService.initalLoad(),
    });
  });

  router.use(express.urlencoded({ extended: true }));

  router.post("/", function (req, res) {
    console.log("===============");
    console.log("IVE BEEN POSTED");
    console.log("===============");
    console.log("");
    createNewTermService
      .searchForMiiFiles(req.body.filter_field)
      .then((result) => {
        res.render("modifyTerm", { data: result });
      });
  });
  return router;
};
