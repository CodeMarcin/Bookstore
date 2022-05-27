import { LightningElement, wire } from "lwc";

import { checkIsUserAdmin } from "c/utilitiesCheckUserAccessToSite";
import { CurrentPageReference } from "lightning/navigation";

export default class ModuleSubAdminPanelWrapper extends LightningElement {
	isAdmin = false;

	pageName;

	siteToDisplay = {};

	connectedCallback() {
		checkIsUserAdmin()
			.then((result) => {
				this.isAdmin = result;
			})
			.catch((error) => console.log(error));
	}

	@wire(CurrentPageReference)
	getStateParameters(currentPageReference) {
		if (currentPageReference) {
			this.pageName = currentPageReference.attributes.name.slice(0, -3);
			this.setSiteToDisplay();
            console.log(this.pageName, "page name")
		}
	}

	setSiteToDisplay() {
		this.siteToDisplay = { [this.pageName]: true };
	}
}
