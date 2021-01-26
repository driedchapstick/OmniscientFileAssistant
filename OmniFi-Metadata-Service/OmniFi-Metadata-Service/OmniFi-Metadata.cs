﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using System.Timers;


namespace OmniFi_Metadata_Service
{
    public partial class Service1 : ServiceBase
    {

        public Service1()
        {
            InitializeComponent();
            eventLog1 = new System.Diagnostics.EventLog();
            if (!System.Diagnostics.EventLog.SourceExists("OmniFi-Metadata"))
            {
                System.Diagnostics.EventLog.CreateEventSource(
                "OmniFi-Metadata", "OmniFi-Metadata");
            }
            eventLog1.Source = "OmniFi-Metadata";
            eventLog1.Log = "OmniFi-Metadata";
        }

        protected override void OnStart(string[] args)
        {
            eventLog1.WriteEntry("Scanning the Directory");

            MetadataScanner theScan = new MetadataScanner();
            theScan.CommenceScan(eventLog1);
            theScan = null;

            var firstSchedScan = DetermineFirstSchedScan();
            DateTime schedScan = firstSchedScan.SchedScan;
            double schedInt = firstSchedScan.SchedInterval;

            //WE HAVE THE FIRST TIME THE SCHEDUDLED SCAN SHOULD RUN
            //WRITE THE CODE TO CHECK EVERY MINUTE AND THEN UP THE TIME BY THE INTERVAL.

            Timer timer = new Timer();
            timer.Interval = 60000; // 1 Minutes
            timer.Elapsed += delegate { schedScan = this.OnTimer(schedScan, schedInt); };
            timer.Start();
             
        }

        protected override void OnStop()
        {
            eventLog1.WriteEntry("In OnStop.");
            
        }
        public DateTime OnTimer(DateTime leScan, double leInt)
        {
            string entryContent = "The scan is set for "+leScan+"\r\n";
            DateTime currTime = DateTime.Now;
            int result = DateTime.Compare(currTime, leScan);
            if(result >= 0)
            {
                MetadataScanner theScan = new MetadataScanner();
                theScan.CommenceScan(eventLog1);
                leScan = leScan.AddMinutes(leInt);
                entryContent += "THE SCAN IS RUNNING.";
            }
            eventLog1.WriteEntry(entryContent);
            return leScan;
        }
        private (DateTime SchedScan, double SchedInterval) DetermineFirstSchedScan()
        {
            HashSet<Array> leSchedules = new HashSet<Array>(DatabaseConnect.GetComputersSchedule());
            string deBaseTime = "";
            string deInterval = "1440";
            foreach (Array sched in leSchedules)
            {
                string curBaseTime = sched.GetValue(0).ToString().Insert(2, ":");
                string curInterval = sched.GetValue(1).ToString();
                if (Int32.Parse(curInterval) <= Int32.Parse(deInterval))
                {
                    deBaseTime = curBaseTime;
                    deInterval = curInterval;
                }
            }
            DateTime baseTime = DateTime.ParseExact(deBaseTime, "HH:mm", CultureInfo.InvariantCulture);
            double interval = double.Parse(deInterval, CultureInfo.InvariantCulture);
            DateTime firstSchedScan;
            var loopCont = true;
            do{
                baseTime = baseTime.AddMinutes(interval);
                int results = DateTime.Compare(baseTime, DateTime.Now);

                if (results >= 0){loopCont = false;}
               
                firstSchedScan = baseTime;

            } while (loopCont);
            (DateTime SchedScan, double SchedInterval) schedStuff = (firstSchedScan, interval);
            return schedStuff;
        }
    }
}