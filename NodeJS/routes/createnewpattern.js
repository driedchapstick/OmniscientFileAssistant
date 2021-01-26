const express = require("express");
const { Connection } = require("tedious");
const createNewPatternService = require("../services/CreateNewPatternService.js");
const router = express.Router();

module.exports = () => {
  router.get("/", function (req, res) {
    res.render("createNewPattern", {
      data: createNewPatternService.initalLoad(),
    });
  });

  router.use(express.urlencoded({ extended: true }));

  router.post("/", function (req, res) {
    console.log("===============");
    console.log("IVE BEEN POSTED");
    console.log("===============");
    console.log("");
    createNewAuditService
      .searchForMiiFiles(req.body.filter_field)
      .then((result) => {
        res.render("createNewPattern", { data: result });
      });
  });
  return router;
};
