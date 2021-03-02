const express = require("express");
const { Connection } = require("tedious");
const CreateScheduleService = require("../services/CreateScheduleService");
const router = express.Router();

module.exports = () => {
    router.use(express.urlencoded({ extended: true }));
    router.get("/", function (req, res){
        CreateScheduleService.InitialLoad().then((results) => {
            res.render("CreateSchedule", {ints: results});
        });
    });
    router.post("/", function (req, res){
        CreateScheduleService.CreateSchedule(req.body.SchedName, req.body.BaseTime, req.body.InterID);
        res.redirect("/ScheduleConfig");
    })
    return router;
}