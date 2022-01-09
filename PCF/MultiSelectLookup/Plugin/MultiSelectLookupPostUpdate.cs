using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;

namespace MDT.Plugins.MultiSelectLookup
{
    public class MultiSelectLookupPostUpdate : IPlugin
    {
        string _unsecureConfigData = string.Empty;
        string _secureConfigData = string.Empty;

        public MultiSelectLookupPostUpdate(string unsecureConfig, string secureConfig)
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

            if (context.InputParameters.Contains("Target") && context.MessageName == "Update")
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

                                    QueryExpression query = new QueryExpression(attribute._relationshipName);
                                    query.ColumnSet.AddColumns(attribute._details._linkFromAttributeName, attribute._details._relatedAttributeName);
                                    query.Criteria.AddCondition(attribute._details._relatedAttributeName, ConditionOperator.Equal, target.Id);
                                    LinkEntity linkEntity = query.AddLink(attribute._details._linkToEntityName, attribute._details._linkFromAttributeName, attribute._details._linkToAttributeName);
                                    linkEntity.EntityAlias = attribute._details._linkToEntityName;
                                    linkEntity.Columns.AddColumn(attribute._details._linkToPrimaryAttributeName);

                                    EntityCollection data = service.RetrieveMultiple(query);
                                    if (data.Entities.Count > 0)
                                    {
                                        List<LookupObject> existingObjects = new List<LookupObject>();
                                        foreach (Entity related in data.Entities)
                                        {
                                            existingObjects.Add(new LookupObject(
                                                related.GetAttributeValue<Guid>(attribute._details._linkToAttributeName).ToString(), 
                                                related.GetAttributeValue<AliasedValue>(attribute._details._linkToEntityName + "." + attribute._details._linkToPrimaryAttributeName).Value.ToString(), 
                                                attribute._details._linkToEntityName));
                                        }

                                        List<LookupObject> itemsToAdd = new List<LookupObject>(); // lookupObjects.Except(existingObjects).ToList<LookupObject>();
                                        List<LookupObject> itemsToRemove = new List<LookupObject>(); // existingObjects.Except(lookupObjects).ToList<LookupObject>();

                                        EntityReferenceCollection relatedReferencesToAdd = new EntityReferenceCollection();
                                        foreach (LookupObject item in lookupObjects)
                                        {
                                            var itemExists = existingObjects.Exists(x => x._id == item._id);
                                            if (!itemExists)
                                            {
                                                itemsToAdd.Add(item);
                                                relatedReferencesToAdd.Add(new EntityReference(item._etn, new Guid(item._id)));
                                            }
                                        }

                                        EntityReferenceCollection relatedReferencesToRemove = new EntityReferenceCollection();
                                        foreach (LookupObject item in existingObjects)
                                        {
                                            var itemExists = lookupObjects.Exists(x => x._id == item._id);
                                            if (!itemExists)
                                            {
                                                itemsToRemove.Add(item);
                                                relatedReferencesToRemove.Add(new EntityReference(item._etn, new Guid(item._id)));
                                            }
                                        }

                                        if (itemsToAdd.Count > 0)
                                        {
                                            AssociateRequest addRequest = new AssociateRequest();
                                            addRequest.Target = target.ToEntityReference();
                                            addRequest.Relationship = new Relationship(attribute._relationshipName);
                                            addRequest.RelatedEntities = relatedReferencesToAdd;
                                            AssociateResponse addResponse = (AssociateResponse)service.Execute(addRequest);
                                        }

                                        if (itemsToRemove.Count > 0)
                                        {
                                            DisassociateRequest removeRequest = new DisassociateRequest();
                                            removeRequest.Target = target.ToEntityReference();
                                            removeRequest.Relationship = new Relationship(attribute._relationshipName);
                                            removeRequest.RelatedEntities = relatedReferencesToRemove;
                                            DisassociateResponse removeResponse = (DisassociateResponse)service.Execute(removeRequest);
                                        }

                                        foreach (LookupObject lookupObject in lookupObjects)
                                            lookupObjectNames.Add(lookupObject._name);

                                        // Update Text Attribute
                                        string updateAttributeValue = String.Join(",", lookupObjectNames);
                                        tracingService.Trace("Text Updated to: ", updateAttributeValue);
                                        Entity update = new Entity(target.LogicalName);
                                        update.Id = target.Id;
                                        update.Attributes[attribute._textAttributeName] = updateAttributeValue;
                                        service.Update(update);
                                    }
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
