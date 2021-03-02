const express = require("express");
const { Connection } = require("tedious");
const DeleteIntervalService = require("../services/DeleteIntervalService");
const router = express.Router();

module.exports = () => {
    router.use(express.urlencoded({ extended: true }));
    router.get("/", function (req, res){
        DeleteIntervalService.InitialLoad().then((results) => {
            res.render("DeleteInterval", {ints: results});
        });
    });
    router.post("/", function(req, res){
        DeleteIntervalService.DeleteInterval(req.body.InterID).then(() =>{
            res.redirect("/ScheduleConfig");
        })
    })
    return router;
}