import { LightningElement, api, track, wire } from 'lwc';
import getOpp from '@salesforce/apex/CCRequest_mn.getOpp';
import updateRecord from '@salesforce/apex/CCRequest_mn.updateRecord';
import getResults from '@salesforce/apex/CCRequest_mn.getResults';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getObjectInfo,getFieldValue,getFieldDisplayValue,getRecord } from 'lightning/uiObjectInfoApi';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';
import  Customer_Platform from '@salesforce/schema/Opportunity.Customer_Platform__c';
import  Document_Type from '@salesforce/schema/Opportunity.Document_Type__c';
import  Service_Type from '@salesforce/schema/Opportunity.Service_Type__c';
import  SPR from '@salesforce/schema/Opportunity.SPR__c';



export default class CCRequest_mn extends LightningElement {
    @api recordId;
    opportunity;
    error;
    @wire(getOpp,{recid: '$recordId'}) 
    wiredopp({ error, data }) {
        if (data) {
            this.opportunity = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.opportunity = undefined;
        }
    }

    
    @wire(getObjectInfo, { objectApiName: OPPORTUNITY_OBJECT })
    oppMetadata;

    //Customer Platform Picklist
    @wire(getPicklistValues,
        {
            recordTypeId: '$oppMetadata.data.defaultRecordTypeId',
            fieldApiName: Customer_Platform
        }
    )
    customerplatformPicklist;

    handleSelectcustomerplatform(event) {
        this.valuecustomerplatform = event.target.value;
    }

    //Document Type Picklist
    @wire(getPicklistValues,
        {
            recordTypeId: '$oppMetadata.data.defaultRecordTypeId', 
            fieldApiName: Document_Type
        }
    )
    documenttypePicklist;

    handleSelectdocumenttype(event) {
        this.valuedocumenttype = event.target.value;
    }

    handleSuccess(event) {
        this.recordId = event.detail.id;
    }

    //Service Type Picklist
    // @track servicetypePicklist;
    @wire(getPicklistValues,
        {
            recordTypeId: '$oppMetadata.data.defaultRecordTypeId', 
            fieldApiName: Service_Type
        }
    )
    servicetypePicklist;

    handleSelectservicetype(event) {
        this.valueservicetype = event.target.value;
        console.log(this.valueservicetype);
    }



    //SPR Picklist
    @wire(getPicklistValues,
        {
            recordTypeId: '$oppMetadata.data.defaultRecordTypeId', 
            fieldApiName: SPR
        }
    )
    sprPicklist;

    handleSelectSPR(event) {
        this.valueSPR = event.target.value;
    }

    handleSelectcan(event) {
        this.valuecan = event.target.value;
    }

    handleSelectcpqnumber(event) {
        this.valuecpqnumber = event.target.value;
    }

    //Multi Select Picklist

    @api objectName = 'Opportunity';
    @api fieldName = 'Service_Type__c';
    @api Label;
    @track searchRecords = [];
    @track selectedRecords = [];
    @api required = false;
    @api iconName = 'action:new_account'
    @api LoadingText = false;
    @track txtclassname = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
    @track messageFlag = false;
 
    searchField(event) {

        var currentText = event.target.value;
        var selectRecId = [];
        for(let i = 0; i < this.selectedRecords.length; i++){
            selectRecId.push(this.selectedRecords[i].recId);
        }
        this.LoadingText = true;
        getResults({ ObjectName: this.objectName, fieldName: this.fieldName, value: currentText, selectedRecId : selectRecId })
        .then(result => {
            this.searchRecords= result;
            this.LoadingText = false;
            
            this.txtclassname =  result.length > 0 ? 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open' : 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
            if(currentText.length > 0 && result.length == 0) {
                this.messageFlag = true;
            }
            else {
                this.messageFlag = false;
            }

            if(this.selectRecordId != null && this.selectRecordId.length > 0) {
                this.iconFlag = false;
                this.clearIconFlag = true;
            }
            else {
                this.iconFlag = true;
                this.clearIconFlag = false;
            }
        })
        .catch(error => {
            console.log('-------error-------------'+error);
            console.log(error);
        });
        
    }
    
   setSelectedRecord(event) {
        var recId = event.currentTarget.dataset.id;
        var selectName = event.currentTarget.dataset.name;
        let newsObject = { 'recId' : recId ,'recName' : selectName };
        this.selectedRecords.push(newsObject);
        this.txtclassname =  'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
        let selRecords = this.selectedRecords;
		this.template.querySelectorAll('lightning-input').forEach(each => {
            each.value = '';
        });
        const selectedEvent = new CustomEvent('selected', { detail: {selRecords}, });
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
        console.log(this.selectedRecords);
    }

    removeRecord (event){
        let selectRecId = [];
        for(let i = 0; i < this.selectedRecords.length; i++){
            if(event.detail.name !== this.selectedRecords[i].recId)
                selectRecId.push(this.selectedRecords[i]);
        }
        this.selectedRecords = [...selectRecId];
        let selRecords = this.selectedRecords;
        const selectedEvent = new CustomEvent('selected', { detail: {selRecords}, });
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }

    
    
    @track isModalOpen = false;
    openModal() {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
    }
    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        updateRecord({
            recid : this.recordId,
            CustomerPlatform : this.valuecustomerplatform,
            CustomerAccountNumber : this.valuecan,
            CPQQuoteNumber : this.valuecpqnumber,
            DocumentType : this.valuedocumenttype,
            ServiceType : this.selectedRecords,
            SPR : this.valueSPR
        }).then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Custom Contract Request Created',
                    variant: 'success',
                }),
            );
        })
        .catch((error) => {
            console.log(JSON.stringify(error));
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error Creating Custom Contract Request',
                    message: error.body.message,
                    variant: 'error',
                }),
            );
        }).finally(() => {});

        this.isModalOpen = false;
    }
}