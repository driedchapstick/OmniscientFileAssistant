using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OmniFi_Metadata_Service
{
    public class MatchCriteria
    {
        private int criteriaID;
        private string criteriaName;
        private bool backup;
        private HashSet<int> criteriaTerms;


        public int CriteriaID
        {
            get { return criteriaID; }
            set { criteriaID = value; }
        }
        public string CriteriaName
        {
            get { return criteriaName; }
            set { criteriaName = value; }
        }
        public bool Backup
        {
            get { return backup; }
            set { backup = value; }
        }
        public HashSet<int> CriteriaTerms
        {
            get { return criteriaTerms; }
            set { criteriaTerms = value; }
        }
        public void AddTerm(int newTerm)
        {
            criteriaTerms.Add(newTerm);
        }
        public MatchCriteria(int suppliedCriteriaID, string suppliedName, bool suppliedBackup)
        {
            CriteriaID = suppliedCriteriaID;
            CriteriaName = suppliedName;
            Backup = suppliedBackup;
            CriteriaTerms = new HashSet<int>();
        }
    }
}
