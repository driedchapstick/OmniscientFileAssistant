const express = require("express");
const { Connection } = require("tedious");
const CreateIntervalService = require("../services/CreateIntervalService");
const router = express.Router();

module.exports = () => {
    router.use(express.urlencoded({ extended: true }));
    router.get("/", function (req, res){
        res.render("CreateInterval");
    });
    router.post("/", function(req, res){
        CreateIntervalService.AddInterval(req.body.Inter);
        res.redirect("/ScheduleConfig");
    });
    return router;
}