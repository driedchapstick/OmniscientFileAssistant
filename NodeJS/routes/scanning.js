const express = require("express");
const { Connection } = require("tedious");
const scanningService = require("../services/ScanningService");
const router = express.Router();

module.exports = () => {
  router.get("/", function (req, res) {
    res.render("scanning", { data: scanningService.initalLoad() });
  });

  router.use(express.urlencoded({ extended: true }));

  router.post("/", function (req, res) {
    console.log("===============");
    console.log("IVE BEEN POSTED");
    console.log("===============");
    console.log("");
    scanningService.searchForMiiFiles(req.body.filter_field).then((result) => {
      res.render("scanning", { data: result });
    });
  });
  //Got to 4:20 on LinkedIn Learning course for subpath routing (Section 3 Episode 3)
  return router;
};
