using System;
using System.Collections.Generic;
using System.Text;
using System.Data.SqlClient;
using System.Collections;
using System.Globalization;

namespace OmniFi_Metadata_Service
{
    public static class DatabaseConnect
    {
        static readonly string connectionString = "";
        static readonly CultureInfo usaDates = new CultureInfo("en-US");
        public static ArrayList GetAllMatchCriteria(ArrayList allMatchCriteria)
        {
            using (SqlConnection theConnection = new SqlConnection(connectionString))
            {
                SqlCommand theCommand = new SqlCommand("GetAllMatchCriteria", theConnection);
                theCommand.CommandType = System.Data.CommandType.StoredProcedure;
                theConnection.Open();

                using (SqlDataReader theReader = theCommand.ExecuteReader())
                {
                    while (theReader.Read())
                    {
                        allMatchCriteria.Add(new MatchCriteria(Int32.Parse(theReader[0].ToString()), theReader[1].ToString(), Convert.ToBoolean(theReader[2].ToString())));
                    }
                }
                theConnection.Close();
            }
            return allMatchCriteria;
        }
        public static ArrayList GetAllCriteriaTerms(ArrayList theCriterias, ArrayList theTerms)
        {
            foreach (MatchCriteria cryBaby in theCriterias)
            {
                using (SqlConnection theConnection = new SqlConnection(connectionString))
                {
                    SqlCommand theCommand = new SqlCommand("GetSpecificCriteriaTerm", theConnection);
                    theCommand.CommandType = System.Data.CommandType.StoredProcedure;
                    theCommand.Parameters.Add("@CriID", System.Data.SqlDbType.Int);
                    theCommand.Parameters["@CriID"].Value = cryBaby.CriteriaID;
                    theConnection.Open();

                    using (SqlDataReader theReader = theCommand.ExecuteReader())
                    {

                        while (theReader.Read())
                        {
                            foreach (Term termite in theTerms)
                            {
                                if (termite.TermID == Int32.Parse(theReader[0].ToString()))
                                {
                                    cryBaby.AddTerm(termite.TermID);
                                }
                            }
                        }
                    }
                    theConnection.Close();
                }
            }
            return theCriterias;
        }
        public static ArrayList GetAllTerms(ArrayList allTerms)
        {
            using (SqlConnection theConnection = new SqlConnection(connectionString))
            {
                SqlCommand theCommand = new SqlCommand("GetAllTerms", theConnection);
                theCommand.CommandType = System.Data.CommandType.StoredProcedure;
                theConnection.Open();

                using (SqlDataReader theReader = theCommand.ExecuteReader())
                {
                    while (theReader.Read())
                    {
                        allTerms.Add(new Term(Int32.Parse(theReader[0].ToString()), theReader[2].ToString(), theReader[3].ToString()));
                    }
                }
                theConnection.Close();
            }
            return allTerms;
        }
        public static HashSet<FoundFile> GetAllFoundFiles(HashSet<FoundFile> allOldFiles)
        {
            using (SqlConnection theConnection = new SqlConnection(connectionString))
            {
                SqlCommand theCommand = new SqlCommand("GetAllFoundFiles", theConnection);
                theCommand.CommandType = System.Data.CommandType.StoredProcedure;

                theConnection.Open();

                using (SqlDataReader theReader = theCommand.ExecuteReader())
                {
                    while (theReader.Read())
                    {
                        allOldFiles.Add(new FoundFile(theReader[1].ToString(), theReader[2].ToString(), theReader[3].ToString(), theReader[4].ToString(), theReader[5].ToString(), theReader[6].ToString(), theReader[7].ToString(), theReader[8].ToString()));
                    }
                }
                theConnection.Close();
            }
            return allOldFiles;
        }
        public static HashSet<FoundFile> GetComputersFoundFiles(HashSet<FoundFile> allOldFiles)
        {
            using (SqlConnection theConnection = new SqlConnection(connectionString))
            {
                SqlCommand theCommand = new SqlCommand("GetComputersFoundFiles", theConnection);
                theCommand.CommandType = System.Data.CommandType.StoredProcedure;

                theCommand.Parameters.Add("@CompName", System.Data.SqlDbType.NVarChar);
                theCommand.Parameters["@CompName"].Value = Environment.MachineName;

                theConnection.Open();

                using (SqlDataReader theReader = theCommand.ExecuteReader())
                {
                    while (theReader.Read())
                    {
                        allOldFiles.Add(new FoundFile(theReader[1].ToString(), theReader[2].ToString(), theReader[3].ToString(), theReader[4].ToString(), theReader[5].ToString(), theReader[6].ToString(), theReader[7].ToString(), theReader[8].ToString()));
                    }
                }
                theConnection.Close();
            }
            return allOldFiles;
        }
        public static void AddFoundFiles(HashSet<FoundFile> allFoundFiles)
        {
            using (SqlConnection theConnection = new SqlConnection(connectionString))
            {
                SqlCommand theCommand = new SqlCommand("AddFoundFiles", theConnection);
                theCommand.CommandType = System.Data.CommandType.StoredProcedure;

                theCommand.Parameters.Add("@FileName", System.Data.SqlDbType.NVarChar);
                theCommand.Parameters.Add("@FilePath", System.Data.SqlDbType.NVarChar);
                theCommand.Parameters.Add("@FileExt", System.Data.SqlDbType.NVarChar);
                theCommand.Parameters.Add("@CompName", System.Data.SqlDbType.NVarChar);
                theCommand.Parameters.Add("@FileCreator", System.Data.SqlDbType.NVarChar);
                theCommand.Parameters.Add("@FileCreated", System.Data.SqlDbType.DateTime2);
                theCommand.Parameters.Add("@FileModified", System.Data.SqlDbType.DateTime2);
                theCommand.Parameters.Add("@FileSize", System.Data.SqlDbType.NVarChar);

                foreach (FoundFile file in allFoundFiles)
                {

                    theCommand.Parameters["@FileName"].Value = file.FileName;
                    theCommand.Parameters["@FilePath"].Value = file.FilePath;
                    theCommand.Parameters["@FileExt"].Value = file.FileExtension;
                    theCommand.Parameters["@CompName"].Value = file.ComputerName;
                    theCommand.Parameters["@FileCreator"].Value = file.FileCreator;
                    theCommand.Parameters["@FileCreated"].Value = Convert.ToDateTime(file.DateCreated, usaDates);
                    theCommand.Parameters["@FileModified"].Value = Convert.ToDateTime(file.DateModified, usaDates);
                    theCommand.Parameters["@FileSize"].Value = file.FileSize;

                    theConnection.Open();

                    using (SqlDataReader theReader = theCommand.ExecuteReader())
                    {
                        while (theReader.Read())
                        {
                            //If I do not incluse this, the connection closes too quickly
                        }
                    }
                    theConnection.Close();
                }
            }
        }
        public static void DeleteFoundFiles(HashSet<FoundFile> zombies)
        {
            using (SqlConnection theConnection = new SqlConnection(connectionString))
            {
                SqlCommand theCommand = new SqlCommand("DeleteFoundFiles", theConnection);
                theCommand.CommandType = System.Data.CommandType.StoredProcedure;

                theCommand.Parameters.Add("@FileName", System.Data.SqlDbType.NVarChar);
                theCommand.Parameters.Add("@FilePath", System.Data.SqlDbType.NVarChar);
                theCommand.Parameters.Add("@FileExt", System.Data.SqlDbType.NVarChar);
                theCommand.Parameters.Add("@CompName", System.Data.SqlDbType.NVarChar);
                theCommand.Parameters.Add("@FileCreator", System.Data.SqlDbType.NVarChar);
                theCommand.Parameters.Add("@FileCreated", System.Data.SqlDbType.DateTime2);
                theCommand.Parameters.Add("@FileModified", System.Data.SqlDbType.DateTime2);
                theCommand.Parameters.Add("@FileSize", System.Data.SqlDbType.NVarChar);

                foreach (FoundFile file in zombies)
                {
                    theCommand.Parameters["@FileName"].Value = file.FileName;
                    theCommand.Parameters["@FilePath"].Value = file.FilePath;
                    theCommand.Parameters["@FileExt"].Value = file.FileExtension;
                    theCommand.Parameters["@CompName"].Value = file.ComputerName;
                    theCommand.Parameters["@FileCreator"].Value = file.FileCreator;
                    theCommand.Parameters["@FileCreated"].Value = Convert.ToDateTime(file.DateCreated, usaDates);
                    theCommand.Parameters["@FileModified"].Value = Convert.ToDateTime(file.DateModified, usaDates);
                    theCommand.Parameters["@FileSize"].Value = file.FileSize;

                    theConnection.Open();

                    using (SqlDataReader theReader = theCommand.ExecuteReader())
                    {
                        while (theReader.Read())
                        {
                            //If I do not incluse this, the connection closes too quickly
                        }
                    }
                    theConnection.Close();
                }
            }
        }
        public static string VerifyFileID(FoundFile leFile)
        {
            string tempString = "";
            using (SqlConnection theConnection = new SqlConnection(connectionString))
            {
                SqlCommand theCommand = new SqlCommand("VerifyFileID", theConnection);
                theCommand.CommandType = System.Data.CommandType.StoredProcedure;

                theCommand.Parameters.Add("@FileName", System.Data.SqlDbType.NVarChar);
                theCommand.Parameters.Add("@FilePath", System.Data.SqlDbType.NVarChar);
                theCommand.Parameters.Add("@FileExt", System.Data.SqlDbType.NVarChar);
                theCommand.Parameters.Add("@CompName", System.Data.SqlDbType.NVarChar);
                theCommand.Parameters.Add("@FileCreator", System.Data.SqlDbType.NVarChar);
                theCommand.Parameters.Add("@FileCreated", System.Data.SqlDbType.DateTime2);
                theCommand.Parameters.Add("@FileModified", System.Data.SqlDbType.DateTime2);
                theCommand.Parameters.Add("@FileSize", System.Data.SqlDbType.NVarChar);

                theCommand.Parameters["@FileName"].Value = leFile.FileName;
                theCommand.Parameters["@FilePath"].Value = leFile.FilePath;
                theCommand.Parameters["@FileExt"].Value = leFile.FileExtension;
                theCommand.Parameters["@CompName"].Value = leFile.ComputerName;
                theCommand.Parameters["@FileCreator"].Value = leFile.FileCreator;
                theCommand.Parameters["@FileCreated"].Value = Convert.ToDateTime(leFile.DateCreated, usaDates);
                theCommand.Parameters["@FileModified"].Value = Convert.ToDateTime(leFile.DateModified, usaDates);
                theCommand.Parameters["@FileSize"].Value = leFile.FileSize;

                theConnection.Open();

                using (SqlDataReader theReader = theCommand.ExecuteReader())
                {
                    while (theReader.Read())
                    {
                        tempString = theReader[0].ToString();

                    }
                }
                theConnection.Close();
            }
            return tempString;
        }
        public static void AddFlaggedFiles(int leFileID, int leCri)
        {
            using (SqlConnection theConnection = new SqlConnection(connectionString))
            {
                SqlCommand theCommand = new SqlCommand("AddFlaggedFiles", theConnection);
                theCommand.CommandType = System.Data.CommandType.StoredProcedure;

                theCommand.Parameters.Add("@FileID", System.Data.SqlDbType.Int);
                theCommand.Parameters.Add("@CriteriaID", System.Data.SqlDbType.Int);

                theCommand.Parameters["@FileID"].Value = leFileID;
                theCommand.Parameters["@CriteriaID"].Value = leCri;
                theConnection.Open();

                using (SqlDataReader theReader = theCommand.ExecuteReader())
                {
                    while (theReader.Read())
                    {
                        //If I do not incluse this (while loop), the connection closes too quickly
                    }
                }
                theConnection.Close();
            }
        }
        public static string GetSpecificFlaggedFiles(int leFileID, int leCriID)
        {
            string tempString = "";
            using (SqlConnection theConnection = new SqlConnection(connectionString))
            {
                SqlCommand theCommand = new SqlCommand("GetSpecificFlaggedFiles", theConnection);
                theCommand.CommandType = System.Data.CommandType.StoredProcedure;

                theCommand.Parameters.Add("@FileID", System.Data.SqlDbType.Int);
                theCommand.Parameters.Add("@CriteriaID", System.Data.SqlDbType.Int);

                theCommand.Parameters["@FileID"].Value = leFileID;
                theCommand.Parameters["@CriteriaID"].Value = leCriID;
                theConnection.Open();

                using (SqlDataReader theReader = theCommand.ExecuteReader())
                {
                    while (theReader.Read())
                    {
                        tempString = theReader[0].ToString();
                    }
                }
                theConnection.Close();
            }
            return tempString;
        }
        public static HashSet<Array> GetComputersAuditFiles()
        {
            HashSet<Array> AuditFiles = new HashSet<Array>();

            using (SqlConnection theConnection = new SqlConnection(connectionString))
            {
                SqlCommand theCommand = new SqlCommand("GetComputersAuditFiles", theConnection);
                theCommand.CommandType = System.Data.CommandType.StoredProcedure;

                theCommand.Parameters.Add("@CompName", System.Data.SqlDbType.NVarChar);
                theCommand.Parameters["@CompName"].Value = Environment.MachineName;

                theConnection.Open();

                using (SqlDataReader theReader = theCommand.ExecuteReader())
                {
                    while (theReader.Read())
                    {
                        //AuditFiles.Add(new FoundFile(theReader[1].ToString(), theReader[2].ToString(), theReader[3].ToString(), theReader[4].ToString(), theReader[5].ToString(), theReader[6].ToString(), theReader[7].ToString(), theReader[8].ToString()));

                        //string[] poop = {AuditID, FilePath\FileName, Most Recently Recorded Hash, AuditName, HistoryID}
                        string[] poop = { theReader[0].ToString(), theReader[1].ToString() + "\\" + theReader[2].ToString(), theReader[3].ToString(), theReader[4].ToString(), theReader[5].ToString() };
                        AuditFiles.Add(poop);
                        /*
                        Console.WriteLine(theReader[0].ToString());
                        Console.WriteLine(theReader[1].ToString());
                        Console.WriteLine(theReader[2].ToString());
                        Console.WriteLine(theReader[3].ToString());
                        Console.WriteLine(theReader[4].ToString());
                        Console.WriteLine(theReader[5].ToString());
                        Console.WriteLine(theReader[6].ToString());
                        Console.WriteLine(theReader[7].ToString());
                        Console.WriteLine(theReader[8].ToString());
                        Console.WriteLine("");*/

                    }
                }
                theConnection.Close();
            }
            return AuditFiles;
        }
        public static void AddAuditHistory(int auditID, int historyID, string prvHash, string curHash, string auditRepo)
        {
            using (SqlConnection theConnection = new SqlConnection(connectionString))
            {
                SqlCommand theCommand = new SqlCommand("AddAuditHistory", theConnection);
                theCommand.CommandType = System.Data.CommandType.StoredProcedure;

                theCommand.Parameters.Add("@AuditID", System.Data.SqlDbType.Int);
                theCommand.Parameters.Add("@HistoryID", System.Data.SqlDbType.Int);
                theCommand.Parameters.Add("@PrvHash", System.Data.SqlDbType.Char);
                theCommand.Parameters.Add("@CurHash", System.Data.SqlDbType.Char);
                theCommand.Parameters.Add("@AuditDate", System.Data.SqlDbType.DateTime);
                theCommand.Parameters.Add("@AuditRepo", System.Data.SqlDbType.NVarChar);

                theCommand.Parameters["@AuditID"].Value = auditID;
                theCommand.Parameters["@HistoryID"].Value = historyID;
                theCommand.Parameters["@PrvHash"].Value = prvHash;
                theCommand.Parameters["@CurHash"].Value = curHash;
                theCommand.Parameters["@AuditDate"].Value = DateTime.Now;
                theCommand.Parameters["@AuditRepo"].Value = auditRepo;

                theConnection.Open();

                using (SqlDataReader theReader = theCommand.ExecuteReader())
                {
                    while (theReader.Read())
                    {
                        //If I do not incluse this (while loop), the connection closes too quickly
                    }
                }
                theConnection.Close();
            }
        }
        public static HashSet<Array> GetComputersSchedule()
        {
            HashSet<Array> schedules = new HashSet<Array>();
            using (SqlConnection theConnection = new SqlConnection(connectionString))
            {
                SqlCommand theCommand = new SqlCommand("GetComputersSchedule", theConnection);
                theCommand.CommandType = System.Data.CommandType.StoredProcedure;

                theCommand.Parameters.Add("@CompName", System.Data.SqlDbType.NVarChar);
                theCommand.Parameters["@CompName"].Value = Environment.MachineName;

                theConnection.Open();

                using (SqlDataReader theReader = theCommand.ExecuteReader())
                {
                    while (theReader.Read())
                    {
                        //{BaseTime, Interval}
                        string[] sched = { theReader[0].ToString(), theReader[1].ToString() };
                        schedules.Add(sched);
                    }
                }
                theConnection.Close();
            }
            return schedules;
        }
    }
}
