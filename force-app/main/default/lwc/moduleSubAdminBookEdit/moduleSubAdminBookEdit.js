import { LightningElement, wire, track } from "lwc";

import { CurrentPageReference } from "lightning/navigation";

import basePath from "@salesforce/community/basePath";
import getAllBooksApex from "@salesforce/apex/AdminController.getAllBooks";

import adminBookEditLabel from "@salesforce/label/c.adminBookEditText";

import editIconResource from "@salesforce/resourceUrl/DetailsIcon";
import basicIconResource from "@salesforce/resourceUrl/EditIcon";


export default class ModuleSubAdminBookEdit extends LightningElement {
	adminBookEditText = adminBookEditLabel;

	@track allBooksData;

	editIcon = editIconResource;
	basicIcon = basicIconResource;




	get allBooks() {
		return this.allBooksData?.map((el) => ({
			bookId: el.Id,
			bookTitle: el.Title__c,
            bookSold: el.Sold__c,
            bookHref: basePath + "/admin-book-edit?bookId=" + el.Id
		}));
	}

	@wire(CurrentPageReference)
	getStateParameters(currentPageReference) {
		if (currentPageReference) {
			if (!currentPageReference.state.bookId) {
				getAllBooksApex()
					.then((result) => {
						this.allBooksData = result;
						console.log(this.allBooksData);
					})
					.catch((error) => {
						console.log(error);
					});
			}
			// else if (currentPageReference.state.bookId) {
			// 	this.globalAuthorId = currentPageReference.state.bookId;
			// 	getSingleAuthorApex({ authorId: this.globalAuthorId })
			// 		.then((result) => {
			// 			this.singleAuthorEdit = true;
			// 			this.singleAuthorData = result;
			// 		})
			// 		.catch((error) => {
			// 			console.log(error);
			// 		});
			// }
		}
	}
}
