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
        //I do not include an attribute for TermType because TermTypes can only be adjusted with administrative actions. 
        private string termName;
        private string termValue;

        public int TermID
        {
            get { return termID; }
            set { termID = value; }
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

        public Term(int suppliedID, string suppliedName, string suppliedValue)
        {
            TermID = suppliedID;
            TermName = suppliedName;
            TermValue = suppliedValue;
        }
    }
}
