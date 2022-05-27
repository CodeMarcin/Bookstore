import { LightningElement, wire, track } from "lwc";
import { CurrentPageReference } from "lightning/navigation";

import isGuest from "@salesforce/user/isGuest";
import userId from "@salesforce/user/Id";

import getBookDetail from "@salesforce/apex/DisplayBookController.getBookDetail";
import quantityLabel from "@salesforce/label/c.quantitytext";
import availableQuantityLabel from "@salesforce/label/c.availablequantitytext";

export default class ModuleSubBookDetail extends LightningElement {
	quantityText = quantityLabel;
	availableQuantityText = availableQuantityLabel;

	globalBookId;

	@track bookDetails;

	orderData = { userId: null, bookId: null, quantity: 1 };

	connectedCallback() {

			this.orderData = { ...this.orderData, userId:  isGuest ? "guest" : userId};
		
	}

	@wire(CurrentPageReference)
	getStateParameters(currentPageReference) {
		if (currentPageReference) {
			this.globalBookId = currentPageReference.state.Id;
			if (this.globalBookId) {
				getBookDetail({ bookId: this.globalBookId }).then((result) => {
					this.bookDetails = result;
					this.orderData = { ...this.orderData, bookId: this.bookId };
				});
			}
		}
	}

	get bookId() {
		return this.bookDetails.Id;
	}

	get bookTitle() {
		return this.bookDetails.Title__c;
	}

	get bookImage() {
		return this.bookDetails.Image__c;
	}

	get bookDescription() {
		return this.bookDetails.Description__c;
	}

	get bookISBN() {
		return this.bookDetails.ISBN__c;
	}

	get bookPrice() {
		return this.bookDetails.Price__c;
	}

	get bookDiscountPrice() {
		return this.bookDetails.Discount_Price__c;
	}

	get bookAmount() {
		return this.bookDetails.Amount__c;
	}

	get bookAuthorFullName() {
		return this.bookDetails.Author__r.Name;
	}

	get bookAuthorId() {
		return this.bookDetails.Author__r.Id;
	}

	handlequantityinput(event) {
		if (event.target.value > this.bookAmount) {
			event.target.value = this.bookAmount;
		} else if (event.target.value < 1) {
			event.target.value = 1;
		}

		this.orderData = { ...this.orderData, quantity: event.target.value };
	}

	handleAddToCart() {
		localStorage.setItem(
			"ORDER_BOOK_ID_" + this.bookId + "_USER_ID_" + this.orderData.userId,
			JSON.stringify(this.orderData)
		);
		window.location.href = "shopping-cart";
	}
}
