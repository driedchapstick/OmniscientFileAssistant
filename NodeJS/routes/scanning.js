const express = require("express");
const { Connection } = require("tedious");
const scanningService = require("../services/ScanningService");
const router = express.Router();

module.exports = () => {
  router.use(express.urlencoded({ extended: true }));
  
  router.get("/", function (req, res) {
    res.render("scanning", { data: scanningService.initalLoad() });
  });

  router.post("/", function (req, res) {
    scanningService.ScanningPageSearch(req.body.FileName, req.body.FilePath, req.body.FileExt, req.body.CompName, req.body.FileCreator, req.body.FileCreated, req.body.FileModified, req.body.FileSize).then((result) => {
      res.render("scanning", { data: result });
    });
  });
  //Got to 4:20 on LinkedIn Learning course for subpath routing (Section 3 Episode 3)
  return router;
};
