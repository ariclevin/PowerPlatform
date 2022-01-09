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
        [DataMember] 
        public LookupAttributeDetails _details { get; set; }

        public LookupAttribute(string attributeName, string textAttributeName, string relationshipType, string relationshipName, LookupAttributeDetails details)
        {
            _attributeName = attributeName;
            _textAttributeName = textAttributeName;
            _relationshipType = relationshipType;
            _relationshipName = relationshipName;
            _details = details;
        }
    }

    [DataContract]
    public class LookupAttributeDetails
    {
        [DataMember] 
        public string _primaryEntityName { get; set; }
        [DataMember]
        public string _relatedAttributeName { get; set; }
        [DataMember] 
        public string _linkToEntityName { get; set; }
        [DataMember] 
        public string _linkFromAttributeName { get; set; }
        [DataMember] 
        public string _linkToAttributeName { get; set; }
        [DataMember] 
        public string _linkToPrimaryAttributeName { get; set; }

        public LookupAttributeDetails(string primaryEntityName, string relatedAttributeName, string linkToEntityName, string linkFromAttributeName, string linkToAttributeName, string linkToPrimaryAttributeName)
        {
            _primaryEntityName = primaryEntityName;
            _relatedAttributeName = relatedAttributeName;
            _linkToEntityName = linkToEntityName;
            _linkFromAttributeName = linkFromAttributeName;
            _linkToAttributeName = linkToAttributeName;
            _linkToPrimaryAttributeName = linkToPrimaryAttributeName;
        }
    }
}
