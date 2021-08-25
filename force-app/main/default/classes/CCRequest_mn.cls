public with sharing class CCRequest_mn {

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpp(Id recid) {
        List<Opportunity> opp = new List<Opportunity>();
        opp = [select Id,Name,Customer_Platform__c,Customer_Account_Number__c,CPQ_Quote_Number__c,
                                Document_Type__c,Service_Type__c,SPR__c 
                                From Opportunity where Id=:recid];
        return opp;
    }


    @AuraEnabled
    public static void updateRecord(Id recid,String CustomerPlatform,String CustomerAccountNumber,String CPQQuoteNumber,
                                    String DocumentType,
                                    String ServiceType,
                                    String SPR)
    {
    List<Opportunity> opp = [select Id,Customer_Platform__c,Customer_Account_Number__c,CPQ_Quote_Number__c,
                                Document_Type__c,
                                Service_Type__c,
                                SPR__c 
                                From Opportunity where Id =:recid];
    for(Opportunity op : opp)
    {
    op.Customer_Platform__c = CustomerPlatform;
    op.Customer_Account_Number__c = CustomerAccountNumber;
    op.CPQ_Quote_Number__c = CPQQuoteNumber;
    op.Document_Type__c = DocumentType;
    System.debug(ServiceType);
    op.Service_Type__c = ServiceType;
    System.debug(op.Service_Type__c);
    op.SPR__c = SPR;
    }
    update opp;
    }


    // Multi Picklist

    @AuraEnabled(cacheable=true)
    public static List<SObJectResult> getResults(String ObjectName, String fieldName, String value, List<String> selectedRecId) {
        List<SObJectResult> sObjectResultList = new List<SObJectResult>();
        system.debug(fieldName+'-------------'+ObjectName+'---++----------'+value+'====='+selectedRecId);
        if(selectedRecId == null)
            selectedRecId = new List<String>();

        if(String.isNotEmpty(value)) {
            String query = 'Select Id,'+fieldName+' FROM '+ObjectName+' WHERE '+fieldName+' LIKE \'%' + value.trim() + '%\' and ID NOT IN: selectedRecId';
            system.debug(query);


            Schema.SObjectType s = Schema.getGlobalDescribe().get(objectName) ;
            Schema.DescribeSObjectResult r = s.getDescribe() ;
            Map<String,Schema.SObjectField> fields = r.fields.getMap() ;
            Schema.DescribeFieldResult fieldResult = fields.get(fieldName).getDescribe();
            List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
            for( Schema.PicklistEntry pickListVal : ple){
            System.debug(pickListVal.getLabel());
            String fieldvalue = (String)pickListVal.getLabel();
            sObjectResultList.add(new SObjectResult(fieldvalue));
            }  

            // for(sObject so : Database.Query(query)) {
            //     String fieldvalue = (String)so.get(fieldName);
            //     sObjectResultList.add(new SObjectResult(fieldvalue, so.Id));
            // }
        }
        return sObjectResultList;
    }
    
    public class SObjectResult {
        @AuraEnabled
        public String recName;
        // @AuraEnabled
        // public Id recId;
        
        public SObJectResult(String recNameTemp
        //  ,Id recIdTemp
         ) {
            recName = recNameTemp;
            // recId = recIdTemp;
        }
        public SObJectResult() {
          
        }
    }
}
