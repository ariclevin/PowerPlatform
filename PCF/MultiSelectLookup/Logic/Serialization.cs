using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace MDT.Plugins.MultiSelectLookup
{
    [DataContract]
    public class LookupObject
    {
        [DataMember] 
        public string _id { get; set; }
        [DataMember] 
        public string _name { get; set; }
        [DataMember]
        public string _etn { get; set; }

        public LookupObject(string id, string name, string etn)
        {
            _id = id;
            _name = name;
            _etn = etn;
        }
    }

    [DataContract]
    public class LookupAttribute
    {
        [DataMember] 
        public string _attributeName { get; set; }
        [DataMember]
        public string _textAttributeName { get; set; }
        [DataMember] 
        public string _relationshipType { get; set; }
        [DataMember] 
        public string _relationshipName { get; set; }

        public LookupAttribute(string attributeName, string textAttributeName, string relationshipType, string relationshipName)
        {
            _attributeName = attributeName;
            _textAttributeName = textAttributeName;
            _relationshipType = relationshipType;
            _relationshipName = relationshipName;

        }

    }
}
