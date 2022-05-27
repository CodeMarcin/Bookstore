import { LightningElement } from "lwc";

import getSummaryApex from "@salesforce/apex/AdminController.getSummary";

import adminSummaryLabel from "@salesforce/label/c.adminSummaryText";

export default class ModuleSubAdminSummary extends LightningElement {
	summaryData;

    adminSummaryText = adminSummaryLabel;

	connectedCallback() {
		getSummaryApex()
			.then((result) => {
				this.summaryData = result;
				console.log(this.summaryData, "summary data");
			})
			.catch((error) => {
				console.log(error, "ERROR");
			});
	}

	get allUsersCount() {
		return this.summaryData.allUsersCount;
	}

    get activeUsersCount() {
        return this.summaryData.activeUsersCount;
    }

    get nonActiveUsersCount() {
        return this.summaryData.nonActiveUsersCount;
    }
}
