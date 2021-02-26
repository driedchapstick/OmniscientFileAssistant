const express = require("express");
const { Connection } = require("tedious");
const deleteTermService = require("../services/deleteTermService");
const router = express.Router();

module.exports = () => {
  router.get("/", function (req, res) {
    res.render("deleteTerm", { data: deleteTermService.initalLoad() });
  });

  router.use(express.urlencoded({ extended: true }));

  router.post("/", function (req, res) {
    console.log("===============");
    console.log("IVE BEEN POSTED");
    console.log("===============");
    console.log("");
    deleteTermService
      .searchForMiiFiles(req.body.filter_field)
      .then((result) => {
        res.render("deleteTerm", { data: result });
      });
  });
  return router;
};
