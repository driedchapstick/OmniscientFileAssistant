using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OmniFi_Metadata_Service
{
    class Term
    {
        private int termID;
        private int termType;
        private string termName;
        private string termValue;

        public int TermID
        {
            get { return termID; }
            set { termID = value; }
        }
        public int TermType
        {
            get { return termType; }
            set { termType = value; }
        }
        public string TermName
        {
            get { return termName; }
            set { termName = value; }
        }
        public string TermValue
        {
            get { return termValue; }
            set { termValue = value; }
        }
        public Term(int suppliedID, int suppliedType, string suppliedName, string suppliedValue)
        {
            TermID = suppliedID;
            TermType = suppliedType;
            TermName = suppliedName;
            TermValue = suppliedValue;
        }
    }
}
