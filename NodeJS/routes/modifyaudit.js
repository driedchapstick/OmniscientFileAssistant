const express = require("express");
const { Connection } = require("tedious");
const { GetCurAuditOptions } = require("../services/ModifyAuditService");
const ModifyAuditService = require("../services/ModifyAuditService");
const router = express.Router();

module.exports = () => {
  router.use(express.urlencoded({ extended: true }));

  router.get("/", function (req, res) {
    ModifyAuditService.InitialLoad().then((result)=> {
      res.render("ModifyAudit", { audits: result, });
    });
  });
  router.get("/:subpage", function(req, res){
    ModifyAuditService.GetCurAuditOptions(req.params.subpage, "").then((result) => {
      res.render("IndiAudit", { InputField: result[0], AuditStuff: result[1], FileStuff: result[2], ConfirmSearch: result[3], ConfirmSubmit: result[4]},);
    })
  });
  router.post("/:subpage", function (req, res) { 
    let SearchFields = [req.body.FileName, req.body.FilePath, req.body.FileExt, req.body.CompName, req.body.FileCreator, req.body.FileCreated, req.body.FileModified, req.body.FileSize]
    let SubmitFields = [req.body.FileID, req.body.AuditName]
    //console.log("FileID: "+SubmitFields[0]+" (in POST route)")
    //console.log("AuditName: "+SubmitFields[1]+" (in POST route)")
    let TheStuff = ModifyAuditService.DeterminePost(SearchFields, SubmitFields, req.body.TheButton)
    if(TheStuff == "Good Search"){
      ModifyAuditService.ScanningPageSearch(SearchFields[0], SearchFields[1], SearchFields[2], SearchFields[3], SearchFields[4], SearchFields[5], SearchFields[6], SearchFields[7], SubmitFields[1]).then((Results) =>{
        let ReturnedFiles = Results[0];
        let TheSearchFields = Results[1];
        let ConfirmSearchs = Results[2];
        let ConfirmSubmits = Results[3];
        let AuditName = Results[4];
        res.render("IndiAudit", { InputField: TheSearchFields, AuditStuff: AuditName, FileStuff: ReturnedFiles, ConfirmSearch: ConfirmSearchs, ConfirmSubmit: ConfirmSubmits});
      })
    }else if(TheStuff == "Empty Search"){
      let EmptyPageResults = ModifyAuditService.FailedSearch(req.body.AuditName);
      res.render("IndiAudit", { InputField: EmptyPageResults[1], AuditStuff: EmptyPageResults[4], FileStuff: EmptyPageResults[0], ConfirmSearch: EmptyPageResults[2], ConfirmSubmit:EmptyPageResults[3]});
    }else if(TheStuff == "Good Submit"){
      ModifyAuditService.SuccessfulSubmit(req.params.subpage,SubmitFields[1],SubmitFields[0]).then((result) =>{
        
        res.render("IndiAudit", { InputField: result[0], AuditStuff: result[1], FileStuff: result[2], ConfirmSearch: result[3], ConfirmSubmit:result[4]});
      });
    }else if(TheStuff == "Empty Submit"){

      ModifyAuditService.GetCurAuditOptions(req.params.subpage, "").then((result) => {
        res.render("IndiAudit", { InputField: result[0], AuditStuff: result[1], FileStuff: result[2], ConfirmSearch: "\xa0", ConfirmSubmit:"ERROR: Update Failed"});
      });
    }else{
      res.redirect("../");
    }
  });
  return router;
};
