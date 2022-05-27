import { LightningElement } from "lwc";
import basePath from "@salesforce/community/basePath";

import myShoppingTextLabel from "@salesforce/label/c.MyShoppingText";
import logoutTextLabel from "@salesforce/label/c.LogoutText";
import closeTextLabel from "@salesforce/label/c.CloseText";
export default class ModuleSubShowAdminMenuPanel extends LightningElement {
	adminMenuPanelElements = [
		{ label: "Authors", header: true},
		{ label: "Add author", pageURL: basePath + "/profile-overview" },
		{ label: "Edit author", pageURL: basePath + "/profile-overview" },
		{ label: "Books", header: true},
        { label: "Add book", pageURL: basePath + "/profile-overview" },
		{ label: "Edit book", pageURL: basePath + "/profile-overview" },
		{ label: "Books", header: true},
		{ label: myShoppingTextLabel, pageURL: basePath + "/my-shopping" },
		{ label: logoutTextLabel, pageURL: basePath + "/secur/logout.jsp" },
		{ label: closeTextLabel, pageURL: "", closeButton: true }
	];

    connectedCallback() {

    }

	dispatchCloseAdminMenuPanel() {
		this.dispatchEvent(new CustomEvent("closeadminmenupanelevent"));
	}
}
