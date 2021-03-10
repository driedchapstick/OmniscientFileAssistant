const express = require("express");
const { Connection } = require("tedious");
const CreateNewAuditService = require("../services/CreateNewAuditService");
const router = express.Router();

module.exports = () => {
  router.use(express.urlencoded({ extended: true }));

  router.get("/", function (req, res) {
    let initialData = CreateNewAuditService.initalLoad();
    res.render("CreateNewAudit", { data: initialData[0], InputField: initialData[1], ConfirmSearch: "\xa0", ConfirmSubmit: "\xa0" });
  });

  router.post("/", function (req, res) {
    let SearchFieldsIN = [req.body.FileName, req.body.FilePath, req.body.FileExt, req.body.CompName, req.body.FileCreator, req.body.FileCreated, req.body.FileModified, req.body.FileSize]
    let SubmitFields = [req.body.FileID, req.body.AuditName]
    let TheStuff = CreateNewAuditService.DeterminePost(SearchFieldsIN, SubmitFields, req.body.TheButton)

    if(TheStuff == "Good Search"){
      CreateNewAuditService.ScanningPageSearch(SearchFieldsIN[0], SearchFieldsIN[1], SearchFieldsIN[2], SearchFieldsIN[3], SearchFieldsIN[4], SearchFieldsIN[5], SearchFieldsIN[6], SearchFieldsIN[7], SearchFieldsIN[8]).then((Results) =>{
        let ReturnedFiles = Results[0];
        let TheSearchFields = Results[1];
        let ConfirmSearchs = Results[2];
        res.render("CreateNewAudit", {data: ReturnedFiles, InputField: TheSearchFields, ConfirmSearch: ConfirmSearchs, ConfirmSubmit: "\xa0"});
      })
    }else if(TheStuff == "Empty Search"){
      let EmptyPageResults = CreateNewAuditService.initalLoad();
      res.render("CreateNewAudit", {data: EmptyPageResults[0], InputField: EmptyPageResults[1], ConfirmSearch: "ERROR: File Search Empty", ConfirmSubmit: "\xa0"});
    }else if(TheStuff == "Good Submit"){
      CreateNewAuditService.AddAuditFile(SubmitFields[0], SubmitFields[1]).then((result) =>{
        let EmptyPageResults = CreateNewAuditService.initalLoad();
        res.render("CreateNewAudit", {data: EmptyPageResults[0], InputField: EmptyPageResults[1], ConfirmSearch: "\xa0", ConfirmSubmit: "SUCCESS: Audit Created"});
      });
    }else if(TheStuff == "Empty Submit"){
      let EmptyPageResults = CreateNewAuditService.initalLoad();
      res.render("CreateNewAudit", {data: EmptyPageResults[0], InputField: EmptyPageResults[1], ConfirmSearch: "\xa0", ConfirmSubmit: "ERROR: Required Fields Not Provided"});
    }else{
      let EmptyPageResults = CreateNewAuditService.initalLoad();
      return [EmptyPageResults[0],EmptyPageResults[1], "ERROR: Server Error", "ERROR: Server Error"];
    }
  });
  /*
  router.post("/NewAudit", function (req, res) {
    CreateNewAuditService.AddAuditFile(req.body.AuditName, req.body.FileID).then((result) => {
      if(result == 1){
        res.redirect("/Auditing");
      }else if(result == 0){
        let initialData = CreateNewAuditService.initalLoad();
        res.render("CreateNewAudit", { InputField: initialData[1], data: initialData[0], ConfirmSearch: "\xa0" });
      }else{
        console.log("WTF JUST HAPPENED");
      }
    });
  });*/
  return router;
};
