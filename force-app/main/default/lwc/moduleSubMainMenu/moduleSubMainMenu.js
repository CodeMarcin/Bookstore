import { LightningElement, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";

import basePath from "@salesforce/community/basePath";

import homeText from "@salesforce/label/c.home";
import booksText from "@salesforce/label/c.books";
import discountText from "@salesforce/label/c.discount";
import contactText from "@salesforce/label/c.contact";

export default class ModuleSubMainMenu extends LightningElement {
	pageName = null;
	handleResize;

	menuItems = [
		{ label: homeText, pageURL: basePath },
		{ label: booksText, pageURL: basePath + "/books" },
		{ label: discountText, pageURL: basePath + "/discount" },
		{ label: "Guest order status", pageURL: basePath + "/guest-order"},
		{ label: contactText, pageURL: basePath + "/contact" }
	];

	connectedCallback() {
		this.checkIsMenuItemActive();
	}

	@wire(CurrentPageReference)
	getStateParameters(currentPageReference) {
		if (currentPageReference) {
			this.pageName = currentPageReference.attributes.name;
		}
	}

	checkIsMenuItemActive() {
		for (let menuItem of this.menuItems) {
			if (menuItem.pageURL === basePath && this.pageName === "Home") {
				menuItem.active = true;
			} else if (menuItem.pageURL + "__c" === basePath + "/" + this.pageName.toLowerCase()) {
				menuItem.active = true;
			} else {
				menuItem.active = false;
			}
		}
	}
}
