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
        public void CommenceScan(EventLog theEventLog)
        {
            string startingString = "C:\\Users\\johno\\Desktop";
            DirectoryInfo startingDirectory = new DirectoryInfo(startingString);

            ArrayList allFoundFiles = new ArrayList();
            ArrayList allOldFiles = new ArrayList();
            ArrayList allNewFiles = new ArrayList();
            ArrayList allMatchCriteria = new ArrayList();
            ArrayList allTerms = new ArrayList();

            if (startingDirectory.Exists)
            {
                SearchTheDir(startingDirectory, allFoundFiles);
                DatabaseConnect.GetAllMatchCriteria(allMatchCriteria);
                DatabaseConnect.GetAllTerms(allTerms);
                DatabaseConnect.GetAllCriteriaTerms(allMatchCriteria, allTerms);

                RetrieveOldFiles(allOldFiles);
                CompareOldAndFound(allOldFiles, allFoundFiles, allNewFiles);
                SendNewMetadata(allNewFiles, theEventLog);

                InspectFoundFiles(allFoundFiles, allTerms);
                DetermineFlagging(allFoundFiles, allMatchCriteria, theEventLog);
            }
            else
            {
                theEventLog.WriteEntry("COULD NOT FIND THE STARTING DIRECTORY" + " " + "-" + " " + startingString + " " + "!!!!!"+"\r\n"+ "Task was aborted.");
            }
        }
        void SearchTheDir(DirectoryInfo currentParentDir, ArrayList allFoundFiles)
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
                SearchTheDir(direct, allFoundFiles);
            }
        }
        static void InspectFoundFiles(ArrayList scanned, ArrayList suppliedTerms)
        {
            foreach (FoundFile zoomer in scanned)
            {
                if (zoomer.FileExtension.Equals(".txt") || zoomer.FileExtension.Equals(".rtf") || zoomer.FileExtension.Equals(".tex") || zoomer.FileExtension.Equals(".bak") || zoomer.FileExtension.Equals(".doc") || zoomer.FileExtension.Equals(".docx") || zoomer.FileExtension.Equals(".pdf") || zoomer.FileExtension.Equals(".odt") || zoomer.FileExtension.Equals(".wpd"))
                {
                    string fullFile = System.IO.File.ReadAllText(zoomer.FilePath + "\\" + zoomer.FileName);
                    foreach (Term theTerm in suppliedTerms)
                    {
                        int indexOfTerm = fullFile.IndexOf(theTerm.TermValue);

                        if (indexOfTerm != -1)
                        {
                            zoomer.AddTerm(theTerm.TermID);

                        }

                    }
                }
            }
        }
        static void DetermineFlagging(ArrayList scanned, ArrayList theCriers, EventLog leEventLog)
        {
            foreach (MatchCriteria leCri in theCriers)
            {
                foreach (FoundFile leFile in scanned)
                {
                    string entryContent = "";
                    if (leFile.TermsFound.SetEquals(leCri.CriteriaTerms))
                    {
                        entryContent += "File: " + leFile.FilePath + "\\" + leFile.FileName + "\r\n";
                        entryContent += "Match Criteria: " + leCri.CriteriaName + " (#" + leCri.CriteriaID + ")" + "\r\n";
                        entryContent += "\r\n";

                        string possibleFileID = DatabaseConnect.VerifyFileID(leFile);
                        if (possibleFileID.Equals(""))
                        {
                            entryContent += "File does not have a FileID, cannot be flagged." +"\r\n";
                        }
                        else
                        {
                            string possibleFlagID = DatabaseConnect.GetSpecificFlaggedFiles(Int32.Parse(possibleFileID), leCri.CriteriaID);
                            if (possibleFlagID.Equals(""))
                            {
                                DatabaseConnect.AddFlaggedFiles(Int32.Parse(possibleFileID), leCri.CriteriaID);
                                entryContent += "File has been flagged." + "\r\n";
                            }
                            else
                            {
                                entryContent += "The file Was already flagged. (Will not be reflagged.)" + "\r\n";
                            }

                            entryContent += "\r\n";

                            if (leCri.Backup == true)
                            {
                                string srcDir = leFile.FilePath;
                                string destDir = "C:\\Users\\johno\\OmniFileAs" + "\\" + leCri.CriteriaName;
                                Directory.CreateDirectory(destDir);

                                string srcFile = srcDir + "\\" + leFile.FileName;
                                string destFile = destDir + "\\" + leFile.FileName;
                                File.Copy(srcFile, destFile, true);
                                entryContent += "The file has been sent to the central server, as required by the Match Criteria.";
                            }
                            else
                            {
                                entryContent += "The Match Criteria does not require the file to be sent to the central server, therefore it will not.";
                            }
                        }
                        leEventLog.WriteEntry(entryContent);
                    }
                }
            }
        }
        static void CompareOldAndFound(ArrayList oldies, ArrayList scanned, ArrayList noobs)
        {

            foreach (FoundFile zoomer in scanned)
            {
                bool match = false;
                foreach (FoundFile boomer in oldies)
                {
                    if (zoomer.FileName == boomer.FileName & zoomer.FilePath == boomer.FilePath & zoomer.FileExtension == boomer.FileExtension & zoomer.ComputerName == boomer.ComputerName & zoomer.FileCreator == boomer.FileCreator & zoomer.DateCreated == boomer.DateCreated)
                    {
                        match = true;
                        break;
                    }
                }

                if (match == false)
                {
                    noobs.Add(zoomer);
                }
            }

        }
        static void RetrieveOldFiles(ArrayList allOldFiles)
        {
            DatabaseConnect.GetAllFoundFiles(allOldFiles);
            // Aparently, I do not need to assign the output of the function to the allOldFiles variable
            // allOldFiles = databaseConnect.GetAllFoundFiles(allOldFiles);
        }
        static void SendNewMetadata(ArrayList noobs, EventLog leEventLog)
        {
            PrintFiles(noobs, leEventLog);
            DatabaseConnect.AddFoundFiles(noobs);
        }
        static void PrintFiles(ArrayList deNewFiles, EventLog deEventLog)
        {
            foreach (FoundFile file in deNewFiles)
            {
                string entryContent = "";
                entryContent += "New File Found on Computer." + "\r\n";
                entryContent += "\r\n";
                entryContent += "File Name: " + file.FileName + "\r\n";
                entryContent += "File Path: " + file.FilePath + "\r\n";
                entryContent += "File Ext: " + file.FileExtension + "\r\n";
                entryContent += "Computer: " + file.ComputerName + "\r\n";
                entryContent += "Creator: " + file.FileCreator + "\r\n";
                entryContent += "Date Created: " + file.DateCreated + "\r\n";
                entryContent += "Date Modified: " + file.DateModified + "\r\n";
                entryContent += "Size: " + file.FileSize;

                deEventLog.WriteEntry(entryContent);
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
