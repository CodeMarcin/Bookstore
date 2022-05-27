import getLastArrival from "@salesforce/apex/DisplayBookController.getLastArrival";
import { LightningElement, wire } from "lwc";
export default class ModuleSubDisplayLastArrival extends LightningElement {
	lastArrivalData = "";

	@wire(getLastArrival)
	wireGetLastArrival({ error, data }) {
		if (data) {
			this.lastArrivalData = data;
			this.error = undefined;
		} else if (error) {
			this.error = error;
			this.lastArrivalData = undefined;
		}
	}

    get bookId() {
        return this.lastArrivalData.Id;
    }

    get title() {
        return this.lastArrivalData.Title__c;
    }

    get image() {
        return this.lastArrivalData.Image__c;
    }

	get hrefURL() {
		return `book-detail?Id=${this.lastArrivalData.Id}`
		
	}

    get authorFullName() {
        return this.lastArrivalData.Author__r.Name;
    }

	get category() {
		return this.lastArrivalData.Category__r.Name;
	}

}
