const express = require("express");
const { Connection } = require("tedious");
const DeleteScheduleService = require("../services/DeleteScheduleService");
const router = express.Router();

module.exports = () => {
    router.use(express.urlencoded({ extended: true }));
    router.get("/", function (req, res){
        DeleteScheduleService.InitialLoad().then((results) => {
            res.render("DeleteSchedule", {sched: results});
        });
    });
    router.post("/", function (req, res){
        DeleteScheduleService.DeleteSchedule(req.body.SchedID).then(() =>{
            res.redirect("/ScheduleConfig");
        })
    });
    return router;
}