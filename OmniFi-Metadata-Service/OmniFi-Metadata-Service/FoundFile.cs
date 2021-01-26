using System;
using System.Collections.Generic;

namespace OmniFi_Metadata_Service
{
    public class FoundFile
    {
        private String fileName;
        private String filePath;
        private String fileExt;
        private String compName;
        private String fileCreator;
        private String dateCreated;
        private String dateModified;
        private String fileSize;
        private HashSet<int> termsFound;

        public String FileName
        {
            get { return fileName; }
            set { fileName = value; }
        }
        public String FilePath
        {
            get { return filePath; }
            set { filePath = value; }
        }
        public String FileExtension
        {
            get { return fileExt; }
            set { fileExt = value; }
        }
        public String ComputerName
        {
            get { return compName; }
            set { compName = value; }
        }
        public String FileCreator
        {
            get { return fileCreator; }
            set { fileCreator = value; }
        }
        public String DateCreated
        {
            get { return dateCreated; }
            set { dateCreated = value; }
        }
        public String DateModified
        {
            get { return dateModified; }
            set { dateModified = value; }
        }
        public String FileSize
        {
            get { return fileSize; }
            set
            {
                //Removing any spaces or suffixes in case they are on the end of the size.
                int spaceInValue = value.IndexOf(" ");
                if (spaceInValue != -1)
                {
                    fileSize = value;
                }
                else
                {
                    string[] sizeSuffix = { "Bytes", "KB", "MB", "GB", "TB", "PB" };

                    float floatValue = float.Parse(value, System.Globalization.CultureInfo.InvariantCulture);

                    int counter = 0;
                    while (Math.Round(floatValue / 1024) >= 1)
                    {
                        floatValue /= 1024;
                        counter++;
                    }

                    fileSize = System.Math.Round(floatValue, 2).ToString() + " " + sizeSuffix[counter];
                }


            }
        }
        public HashSet<int> TermsFound
        {
            get { return termsFound; }
            set { termsFound = value; }
        }
        public void AddTerm(int newTerm)
        {
            termsFound.Add(newTerm);
        }
        public FoundFile(string suppliedName, string suppliedPath, string suppliedExt,
                         string suppliedComp, string suppliedCreator, string suppliedCreated,
                         string suppliedModed, string suppliedSize)
        {
            FileName = suppliedName;
            FilePath = suppliedPath;
            FileExtension = suppliedExt;
            ComputerName = suppliedComp;
            FileCreator = suppliedCreator;
            DateCreated = suppliedCreated;
            DateModified = suppliedModed;
            FileSize = suppliedSize;
            TermsFound = new HashSet<int>();
        }

    }
    class FoundFileComparer : IEqualityComparer<FoundFile>
    {
        public bool Equals(FoundFile leFile1, FoundFile leFile2)
        {
            if (leFile1.FileName == leFile2.FileName & leFile1.FilePath == leFile2.FilePath & leFile1.FileExtension == leFile2.FileExtension & leFile1.ComputerName == leFile2.ComputerName & leFile1.FileCreator == leFile2.FileCreator & leFile1.DateCreated == leFile2.DateCreated)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        public int GetHashCode(FoundFile leFile)
        {
            return (leFile.FileName + leFile.FilePath + leFile.FileExtension + leFile.ComputerName + leFile.FileCreator + leFile.DateCreated + leFile.DateModified + leFile.FileSize).GetHashCode();
        }
    }
}
