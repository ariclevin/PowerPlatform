using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;

namespace MDT.Plugins.MultiSelectLookup
{
    public class MultiSelectLookupPostCreate : IPlugin
    {
        string _unsecureConfigData = string.Empty;
        string _secureConfigData = string.Empty;

        public MultiSelectLookupPostCreate(string unsecureConfig, string secureConfig)
        {
            if (!string.IsNullOrEmpty(secureConfig))
                _secureConfigData = secureConfig;

            if (!string.IsNullOrEmpty(unsecureConfig))
                _unsecureConfigData = unsecureConfig;            
        }

        public void Execute(IServiceProvider serviceProvider)
        {
            ITracingService tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));

            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(context.UserId);

            if (context.InputParameters.Contains("Target") && context.MessageName == "Create")
            {
                Entity target = (Entity)context.InputParameters["Target"];
                tracingService.Trace("Target Logical Name: {0}", target.LogicalName);

                List<LookupAttribute> lookupAttributes;

                tracingService.Trace("Unsecure Configuration Data: {0}", _unsecureConfigData);
                using (MemoryStream stream = new MemoryStream(Encoding.Unicode.GetBytes(_unsecureConfigData)))
                {
                    DataContractJsonSerializer deserializer = new DataContractJsonSerializer(typeof(List<LookupAttribute>));
                    lookupAttributes = (List<LookupAttribute>)deserializer.ReadObject(stream);
                }

                if (lookupAttributes.Count > 0)
                {
                    foreach (LookupAttribute attribute in lookupAttributes)
                    {
                        tracingService.Trace("Attribute Name: {0}", attribute._attributeName);
                        tracingService.Trace("Text Attribute Name: {0}", attribute._textAttributeName);
                        tracingService.Trace("Relationship Type (Native or Manual): {0}", attribute._relationshipType);
                        tracingService.Trace("Relationship Name: {0}", attribute._relationshipName);

                        string controlData = target.GetAttributeValue<string>(attribute._attributeName);
                        using (MemoryStream dataStream = new MemoryStream(Encoding.Unicode.GetBytes(controlData)))
                        {
                            DataContractJsonSerializer dataDeserializer = new DataContractJsonSerializer(typeof(List<LookupObject>));
                            List<LookupObject> lookupObjects = (List<LookupObject>)dataDeserializer.ReadObject(dataStream);

                            if (attribute._relationshipType.ToLower() == "native")
                            {
                                try
                                {
                                    List<string> lookupObjectNames = new List<string>();
                                    EntityReferenceCollection relatedReferences = new EntityReferenceCollection();

                                    foreach (LookupObject lookupObject in lookupObjects)
                                    {
                                        tracingService.Trace("Lookup Object Name: {0}", lookupObject._name);
                                        tracingService.Trace("Lookup Object Id: {0}", lookupObject._id);
                                        tracingService.Trace("Lookup Object ETN: {0}", lookupObject._etn);
                                        Guid lookupObjectId = new Guid(lookupObject._id);
                                        // EntityReference reference = new EntityReference(lookupObject._etn, lookupObjectId);
                                        relatedReferences.Add(new EntityReference(lookupObject._etn, lookupObjectId));
                                        tracingService.Trace("Adding Related Entity");
                                        
                                        lookupObjectNames.Add(lookupObject._name);
                                        tracingService.Trace("");
                                    }

                                    tracingService.Trace("Executing Associate Request");

                                    AssociateRequest request = new AssociateRequest();
                                    request.Target = target.ToEntityReference();
                                    request.Relationship = new Relationship(attribute._relationshipName);
                                    request.RelatedEntities = relatedReferences;
                                    AssociateResponse response = (AssociateResponse)service.Execute(request);

                                    // Update Text Attribute
                                    tracingService.Trace("Updating Text Attribute");
                                    Entity update = new Entity(target.LogicalName);
                                    update.Id = target.Id;
                                    update.Attributes[attribute._textAttributeName] = String.Join(",", lookupObjectNames);
                                    service.Update(update);

                                }
                                catch (InvalidPluginExecutionException ex)
                                {
                                    throw new InvalidPluginExecutionException(ex.Message);
                                }
                            }
                        }

                    }
                }
            }
        }

    }
}
