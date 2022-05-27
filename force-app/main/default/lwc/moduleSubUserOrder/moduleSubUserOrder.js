import { LightningElement } from "lwc";

import getBookForPreOrder from "@salesforce/apex/BookController.getBookForPreOrder";

import isGuest from "@salesforce/user/isGuest";
import userId from "@salesforce/user/Id";

export default class ModuleSubUserOrder extends LightningElement {
	allOrderData = [];
	filteredOrderData;
	listOfBooksId;

	booksData;
	error;

	connectedCallback() {
		this.getOrderData();
		this.filterOrderData();
		this.setListOfBooksId();

		if (this.listOfBooksId) {
			getBookForPreOrder({ idSet: this.listOfBooksId })
				.then((result) => {
					this.booksData = result;
					console.log(this.booksData, "DATA TO DISPLAY");
				})
				.catch((error) => {
					this.error = error;
					console.log(error);
				});
		}
	}

	getOrderData() {
		const keys = Object.keys(localStorage);
		let i = keys.length;

		while (i--) {
			this.allOrderData.push(JSON.parse(localStorage.getItem(keys[i])));
		}
	}

	filterOrderData() {
		if (isGuest) {
			this.filteredOrderData = this.allOrderData.filter((el) => {
				return el.userId === "guest";
			});
		} else {
			this.filteredOrderData = this.allOrderData.filter((el) => {
				return el.userId === userId;
			});
		}
	}

	setListOfBooksId() {
		this.listOfBooksId = this.filteredOrderData.map((el) => {
			return el.bookId;
		});
	}

	get books() {
		return this.booksData?.map((el) => ({
			id: el.Id,
			title: el.Title__c,
			price: el.Price__c,
			newPrice: el.Discount_Price__c
		}));
	}
}
