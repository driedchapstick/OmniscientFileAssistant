const express = require("express");
const { Connection } = require("tedious");
const createNewTermService = require("../services/CreateNewTermService.js");
const router = express.Router();

module.exports = () => {
  router.get("/", function (req, res) {
    res.render("createNewTerm", {
      data: createNewTermService.initalLoad(),
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
        res.render("createNewTerm", { data: result });
      });
  });
  return router;
};
