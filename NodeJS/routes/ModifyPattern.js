const express = require("express");
const { Connection } = require("tedious");
const ModifyPatternService = require("../services/ModifyPatternService");
const router = express.Router();

module.exports = () => {
  router.use(express.urlencoded({ extended: true }));

  router.get("/", function (req, res) {
    ModifyPatternService.GetPatternsTable().then((result)=> {
      res.render("modifypattern", { data: result});
    });
  });
  router.get("/:subpage", function(req, res){
    ModifyPatternService.GetCurPatternOptions(req.params.subpage, "").then((result) => {
      res.render("IndiPattern", { pats: result[0], terms: result[1], criterms: result[2], ConfirmString: result[3] },)
    })
  });
  router.post("/:subpage", function(req, res){
    ModifyPatternService.UpdateThePattern(req.params.subpage, req.body.name_field, req.body.backupName, req.body.terms).then((result) => {
      res.render("IndiPattern", { pats: result[0], terms: result[1], criterms: result[2], ConfirmString: result[3] },)
    })
  });
  return router;
};
