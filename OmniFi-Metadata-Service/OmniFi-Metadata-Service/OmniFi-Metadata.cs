using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
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

            Timer timer = new Timer();
            timer.Interval = 60000; // 60 seconds
            timer.Elapsed += new ElapsedEventHandler(this.OnTimer);
            timer.Start();

        }

        protected override void OnStop()
        {
            eventLog1.WriteEntry("In OnStop.");
        }
        public void OnTimer(object sender, ElapsedEventArgs args)
        {
            eventLog1.WriteEntry("Scanning the Directory");
            
            MetadataScanner theScan = new MetadataScanner();
            theScan.CommenceScan(eventLog1);
            theScan = null;
        }
    }
}
