using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using System.ComponentModel.DataAnnotations;

namespace OmniFi_Metadata_Service
{
    class FoundFile
    {
        private String fileName;
        private String filePath;
        private String fileExt;
        private String compName;
        private String fileCreator;
        private String dateCreated;
        private String dateModified;
        private String fileSize;

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
                string[] sizeSuffix = { "Bytes", "KB", "MB", "GB", "TB", "PB" };
                float floatValue = float.Parse(value, System.Globalization.CultureInfo.InvariantCulture);

                int counter = 0;
                while (Math.Round(floatValue / 1024) >= 1)
                {
                    floatValue /= 1024;
                    counter++;
                }

                fileSize = floatValue.ToString() + " " + sizeSuffix[counter];
            }
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
        }
    }
}
