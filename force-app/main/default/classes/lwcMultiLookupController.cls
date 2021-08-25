public with sharing class lwcMultiLookupController {
    public lwcMultiLookupController() {

    }
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