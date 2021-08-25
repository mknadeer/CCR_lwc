import { LightningElement,track,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { CloseActionScreenEvent } from 'lightning/actions';

export default class CCRnm extends NavigationMixin(LightningElement) {
    closeModal() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }
    documentTypeValue;
    KSTA = false;
    @api recordId;
    handleSubmit(event) {
        event.preventDefault();
        const fields = event.detail.fields;
        this.documentTypeValue = fields.Document_Type__c
        console.log(this.documentTypeValue);
        this.template
            .querySelector('lightning-record-edit-form').submit(fields);
        console.log(this.KSTA);
        switch (this.documentTypeValue) {
            case "KSTA – KORE SIM Transfer Agreement":
                this.KSTA = true;
                console.log(this.KSTA);
                window.open("https://uatna11.springcm.com/atlas/doclauncher/eos/Custom Contract mn?aid=9909&eos[0].Id={!Opportunity.Id}&eos[0].System=Salesforce&eos[0].Type=Opportunity&eos[0].Name={!Opportunity.Name}&eos[0].ScmPath=/{!Account.Name}/Opportunities");
                break;

            default:
                break;
        }
    }


    handleSuccess(event) {
        const even = new ShowToastEvent({
            title: 'Success!',
            message: 'Opportunity Updated!',
            variant: 'success'
        });
        this.dispatchEvent(even);
        this.dispatchEvent(new CloseActionScreenEvent());   
    }

    get acceptedFormats() {
        return ['.pdf', '.png', '.jpeg','.JPG'];
    }

    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        alert("No. of files uploaded : " + uploadedFiles.length);
    }

}