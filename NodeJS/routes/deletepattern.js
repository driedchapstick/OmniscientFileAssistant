const express = require("express");
const { Connection } = require("tedious");
const DeletePatternService = require("../services/DeletePatternService");
const router = express.Router();

module.exports = () => {
  router.use(express.urlencoded({ extended: true }));

  router.get("/", function (req, res) {
    DeletePatternService.InitialLoad().then((result)=>{
      res.render("DeletePattern", { patts: result, ConfirmString: "\xa0" });
    });
  });

  router.post("/", function (req, res){
    DeletePatternService.DeletePattern(req.body.CriteriaID).then((result) => {
      res.render("DeletePattern", {patts: result[0], ConfirmString: result[1]});
    });
  });

  
  return router;
};
