using System;
using System.IO;
using System.Collections;
using System.Security.AccessControl;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Globalization;
using System.Threading;
using System.Diagnostics;

namespace OmniFi_Metadata_Service
{
    class MetadataScanner
    {
        public void CommenceScan(EventLog theEventLog)
        {
            string[] subFolders = { "Desktop", "Documents", "Downloads", "Pictures", "Videos" };
            string startingString = "C:\\Users\\johno\\";
            HashSet<FoundFile> allFoundFiles = new HashSet<FoundFile>(new FoundFileComparer());
            HashSet<FoundFile> allOldFiles = new HashSet<FoundFile>(new FoundFileComparer());
            HashSet<FoundFile> allNewFiles = new HashSet<FoundFile>(new FoundFileComparer());
            HashSet<FoundFile> allDeadFiles = new HashSet<FoundFile>(new FoundFileComparer());
            ArrayList allMatchCriteria = new ArrayList();
            ArrayList allTerms = new ArrayList();
            try
            { //Comment
                //Do not feel like checking EVERY sub folder in a users folder. That is a lot of useless stuff.
                //Eventually will implement a call to the database to determine which directories to search.
                foreach (string leSub in subFolders)
                {
                    startingString = "C:\\Users\\johno\\" + leSub;

                    DirectoryInfo startingDirectory = new DirectoryInfo(startingString);
                    SearchTheDir(startingDirectory, allFoundFiles);
                }
                //Need to get all the Criterias and Terms setup before I can inspect the files.
                DatabaseConnect.GetAllMatchCriteria(allMatchCriteria);
                DatabaseConnect.GetAllTerms(allTerms);
                DatabaseConnect.GetAllCriteriaTerms(allMatchCriteria, allTerms);
                //Just searches for the terms inside files. No associations are made with criterias.
                InspectFoundFiles(allFoundFiles, allTerms);
                //Get all entries from FoundFiles that are from this computer.
                DatabaseConnect.GetComputersFoundFiles(allOldFiles);
                //Determine who's new, who's old, and who's dead.
                CompareOldAndFound(allOldFiles, allFoundFiles, allNewFiles, allDeadFiles);
                //Adding new files to FoundFiles DB.
                DatabaseConnect.AddFoundFiles(allNewFiles);
                //Removing files that no longer exist on computer from FoundFiles DB.
                DatabaseConnect.DeleteFoundFiles(allDeadFiles);
                //Must run after AddFoundFiles. Want to ensure there are entries in FoundFiles before we add entries to FlaggedFiles.
                //This is where the files are compared against criteria.
                DetermineFlagging(allFoundFiles, allMatchCriteria, theEventLog);
                LetsGetHashin();
            }
            catch (Exception e)
            {
                theEventLog.WriteEntry("COULD NOT FIND A STARTING DIRECTORY\r\nDirectory: " + startingString + "\r\nDirectory will be skipped.");
            }
        }
        static void SearchTheDir(DirectoryInfo currentParentDir, HashSet<FoundFile> allFoundFiles)
        {
            try
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
            catch (UnauthorizedAccessException e)
            {
                /*
                Console.WriteLine("Access Denied to the following directory.");
                Console.WriteLine(currentParentDir.FullName);
                Console.WriteLine("");
                */
            }
            catch (Exception e)
            {
                /*
                Console.WriteLine("Error getting the directory's files or sub directories.");
                Console.WriteLine("NOT an UnauthorizedAccessException!!!");
                Console.WriteLine("");
                Console.Write(e);
                */
            }
        }
        static void InspectFoundFiles(HashSet<FoundFile> scanned, ArrayList suppliedTerms)
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
        static void CompareOldAndFound(HashSet<FoundFile> oldies, HashSet<FoundFile> scanned, HashSet<FoundFile> noobs, HashSet<FoundFile> zombies)
        {
            /*
            oldies = All the file entries retrieved from the DB.
            scanned = All the files found on the computer.

            confirmedOld = The file was found on the computer but already has a FoundFile entry in the DB.
            confirmedNew = The file was found on the computer but DOES NOT have a FoundFIle entry in the DB.
            confirmedDead = The file was NOT found on the computer but DOES have a entry in the DB that needs to be removed.

            noobs = WILL contain the same entries as confirmedNew
            zombies = Will contain the same entries as confirmedDead
            */
            HashSet<FoundFile> confirmedOld = new HashSet<FoundFile>(scanned, new FoundFileComparer());
            HashSet<FoundFile> confirmedNew = new HashSet<FoundFile>(scanned, new FoundFileComparer());
            HashSet<FoundFile> confirmedDead = new HashSet<FoundFile>(oldies, new FoundFileComparer());

            confirmedOld.IntersectWith(oldies);
            confirmedNew.ExceptWith(oldies);
            confirmedDead.ExceptWith(scanned);

            foreach (FoundFile leFile in confirmedNew)
            {
                noobs.Add(leFile);
            }
            foreach (FoundFile leFile in confirmedDead)
            {
                zombies.Add(leFile);
            }
            
        }
        static void DetermineFlagging(HashSet<FoundFile> scanned, ArrayList theCriers, EventLog leEventLog)
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
                        //leEventLog.WriteEntry(entryContent);
                    }
                }
            }
        }
        static void LetsGetHashin()
        {
            // foundAuditFiles = Files who reside on this computer and have an entry in AuditFiles table.
            HashSet<Array> foundAuditFiles = new HashSet<Array>(DatabaseConnect.GetComputersAuditFiles());
            using (SHA256 hasher = SHA256.Create())
            {
                //Each fileAudit is the following --> {AuditID, FilePath\FileName, Most Recently Recorded Hash, AuditName, HistoryID}
                foreach (Array fileAudit in foundAuditFiles)
                {
                    FileInfo leFileInfo = new FileInfo(fileAudit.GetValue(1).ToString());
                    FileStream leFileStream = leFileInfo.Open(FileMode.Open);
                    leFileStream.Position = 0;

                    string newHash = ConvertByteArrayToString(hasher.ComputeHash(leFileStream)).ToUpper();
                    string oldHash = fileAudit.GetValue(2).ToString().ToUpper();

                    if (!(String.Equals(oldHash, newHash)))
                    {
                        // AddAuditHistory(int auditID, int historyID, string prvHash, string curHash, string auditRepo)
                        DatabaseConnect.AddAuditHistory(Int32.Parse(fileAudit.GetValue(0).ToString()), Int32.Parse(fileAudit.GetValue(4).ToString()) + 1, oldHash, newHash, "C:\\TEMP\\DIRECTORY\\");
                    }
                    leFileStream.Close();
                }
            }
        }
        
        public static string ConvertByteArrayToString(byte[] leArray)
        {
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < leArray.Length; i++)
            {
                builder.Append(leArray[i].ToString("X2"));
            }
            return builder.ToString();
        }
        static void PrintNewFiles(ArrayList deNewFiles, EventLog deEventLog)
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
