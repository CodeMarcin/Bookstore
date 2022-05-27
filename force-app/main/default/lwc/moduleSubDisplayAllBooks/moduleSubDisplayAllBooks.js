import { LightningElement, wire, api } from "lwc";
import { CurrentPageReference } from "lightning/navigation";

import getAllBooks from "@salesforce/apex/DisplayBookController.getAllBooks";

import isGuest from "@salesforce/user/isGuest";
import userId from "@salesforce/user/Id";

export default class ModuleSubDisplayAllBooks extends LightningElement {
	@api set categoryIdFromDispatch(categoryId) {
		this._categoryIdFromDispatch = categoryId;
		this.getBooks(this.limitValue, categoryId);
	}

	get categoryIdFromDispatch() {
		return this._categoryIdFromDispatch;
	}

	_categoryIdFromDispatch;

	limitValue = 20;
	orderData;
	booksData;
	error;

	@wire(CurrentPageReference)
	getStateParameters(currentPageReference) {
		if (currentPageReference) {
			if (!currentPageReference.state.categoryId) {
				this.getBooks(this.limitValue, "ALL");
			} else if (currentPageReference.state.categoryId) {
				const categoryIdFromULR = currentPageReference.state.categoryId;
				this.getBooks(this.limitValue, categoryIdFromULR);
			}
		}
	}

	get books() {
		return this.booksData?.map((el) => ({
			bookId: el.Id,
			bookImage: el.Image__c,
			bookPrice: el.Discount_Price__c ? el.Discount_Price__c : el.Price__c,
			bookTitle: el.Title__c,
			bookHref: `book-detail?Id=${el.Id}`,
			bookAuthorFullName: el.Author__r.Name,
			bookCategoryName: el.Category__r.Name,
			bookCategoryId: el.Category__r.Id,
			handleAddToCart: () => {
				if (isGuest) {
					this.orderData = { ...this.orderData, userId: "guest" };
				} else {
					this.orderData = { ...this.orderData, userId: userId };
				}

				this.orderData = { ...this.orderData, bookId: el.Id, quantity: 1 };

				localStorage.setItem(
					"ORDER_BOOK_ID_" + el.Id + "_USER_ID_" + this.orderData.userId,
					JSON.stringify(this.orderData)
				);
				window.location.href = "shopping-cart";
			}
		}));
	}

	getBooks(limitValue, categoryId) {
		getAllBooks({ limitValue: limitValue, categoryId: categoryId })
			.then((result) => {
				this.booksData = result;
			})
			.catch((error) => {
				this.error = error;
			});
	}
}
