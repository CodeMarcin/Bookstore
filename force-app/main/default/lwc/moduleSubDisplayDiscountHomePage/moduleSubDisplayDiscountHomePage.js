import { LightningElement, wire } from "lwc";
import getDiscountBook from "@salesforce/apex/DisplayBookController.getDiscountBook";

import discountBooksLabel from "@salesforce/label/c.discountbookstext";
import basePath from "@salesforce/community/basePath";

export default class ModuleSubDisplayDiscountHomePage extends LightningElement {
	discountBooksText = discountBooksLabel;
	// Multi template render !
	discountData = false;
	error;

	@wire(getDiscountBook, { limitValue: 4 })
	wireGetDiscountBook({ error, data }) {
		if (data) {
			this.discountData = data;
			this.error = undefined;
		} else if (error) {
			this.discountData = undefined;
			this.error = error;
		}
	}

	get discountBooks() {
		return this.discountData?.map((el) => ({
			id: el.Id,
			title: el.Title__c,
			price: el.Price__c,
			newPrice: el.Discount_Price__c,
			image: el.Image__c,
			redirect: () => {
				window.open(basePath + "/book-detail?Id=" + el.Id, "_self")
			}
		}));
	}

}
