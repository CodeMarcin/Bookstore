import { LightningElement } from "lwc";

import basePath from "@salesforce/community/basePath";
import getBaseURLApex from "@salesforce/apex/URLController.getBaseURL";

import profileOverwievTextLabel from "@salesforce/label/c.ProfileOverviewText";
import myShoppingTextLabel from "@salesforce/label/c.MyShoppingText";
import logoutTextLabel from "@salesforce/label/c.LogoutText";
import closeTextLabel from "@salesforce/label/c.CloseText";

export default class ModuleSubShowUserProfilePanel extends LightningElement {
	dataLoad = false;
	userProfilePanelElements = [
		{ label: profileOverwievTextLabel, pageURL: basePath + "/profile-overview" },
		{ label: myShoppingTextLabel, pageURL: basePath + "/my-shopping" }
	];

	connectedCallback() {
		getBaseURLApex()
			.then((result) => {
				this.userProfilePanelElements.push({ label: logoutTextLabel, pageURL: result + "/secur/logout.jsp" });
				this.userProfilePanelElements.push({ label: closeTextLabel, pageURL: "", closeButton: true });
				this.dataLoad = true;
				console.log(this.userProfilePanelElements, "panels");
			})
			.catch((error) => {
				console.log(error);
			});
	}

	dispatchCloseUserProfilePanel() {
		this.dispatchEvent(new CustomEvent("closeuserprofilepanelevent"));
	}
}
