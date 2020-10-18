using System;
using System.IO;
using System.Collections;
using static System.IO.File;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.AccessControl;
using System.Diagnostics;

namespace OmniFi_Metadata_Service
{
    class MetadataScanner
    {
        public void commenceScan(EventLog theEventLog)
        {
            string startingString = "C:\\Users\\johno\\Downloads";
            DirectoryInfo startingDirectory = new DirectoryInfo(startingString);
            ArrayList allFoundFiles = new ArrayList();

            if (startingDirectory.Exists)
            {
                searchTheDir(startingDirectory, allFoundFiles);
                printFiles(allFoundFiles, theEventLog);
            }
            else
            {
                theEventLog.WriteEntry("COULD NOT FIND THE STARTING DIRECTORY" + " " + "-" + " " + startingString + " " + "!!!!!"+"\r\n"+ "Task was aborted.");
            }
        }
        void searchTheDir(DirectoryInfo currentParentDir, ArrayList allFoundFiles)
        {
            FileInfo[] filesInDir = currentParentDir.GetFiles();
            DirectoryInfo[] subDirInDir = currentParentDir.GetDirectories();


            foreach (FileInfo file in filesInDir)
            {
                string user = file.GetAccessControl().GetOwner(typeof(System.Security.Principal.NTAccount)).ToString();
                allFoundFiles.Add(new FoundFile(file.Name, file.DirectoryName, file.Extension, Environment.MachineName, user, file.CreationTime.ToString(), file.LastWriteTime.ToString(), file.Length.ToString()));
            }

            foreach (DirectoryInfo direct in subDirInDir)
            {
                searchTheDir(direct, allFoundFiles);
            }
        }
        void printFiles(ArrayList allFoundFiles, EventLog theEventLog)
        {
            int counter = 1;
            foreach (FoundFile file in allFoundFiles)
            {
                string entryContent = "";

                entryContent += "File " + counter + "\r\n";
                entryContent += "File Name: " + file.FileName + "\r\n";
                entryContent += "File Path: " + file.FilePath + "\r\n";
                entryContent += "File Ext: " + file.FileExtension + "\r\n";
                entryContent += "Computer: " + file.ComputerName + "\r\n";
                entryContent += "Creator: " + file.FileCreator + "\r\n";
                entryContent += "Date Created: " + file.DateCreated + "\r\n";
                entryContent += "Date Modified: " + file.DateModified + "\r\n";
                entryContent += "Size: " + file.FileSize;

                theEventLog.WriteEntry(entryContent);
                counter++;
            }
        }
        void printSpacer(String words)
        {
            string underline = "";
            int wordLength = words.Length;

            for (int i = 0; i < wordLength; i++)
            {
                underline += "-";
            }

            Console.WriteLine("");
            Console.WriteLine(words);
            Console.WriteLine(underline);
        }
    }
}
