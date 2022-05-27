import { LightningElement, wire } from "lwc";



import getBestsellers from "@salesforce/apex/DisplayBookController.getRandomBestseller";
export default class ModuleSubDisplayBestsellers extends LightningElement {
	bestsellersData;
	error;

	@wire(getBestsellers)
	wiredGetBestsellers({ error, data }) {
		if (data) {
			this.bestsellersData = data;
			this.error = undefined;
		} else if (error) {
			this.error = error;
			this.bestsellersData = undefined;
		}
	}

    get bookId() {
        return this.bestsellersData.Id;
    }

    get title() {
        return this.bestsellersData.Title__c;
    }

    get image() {
        return this.bestsellersData.Image__c;
    }

    get hrefURL() {
        return `book-detail?Id=${this.bestsellersData.Id}`;
    }

    get authorFullName() {
        return this.bestsellersData.Author__r.Name;
    }

    get category() {
        return this.bestsellersData.Category__r.Name;
    }
}
