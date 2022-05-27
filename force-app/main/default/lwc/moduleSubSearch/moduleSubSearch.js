import { LightningElement } from "lwc";

import basePath from "@salesforce/community/basePath";

import searchBarLabel from "@salesforce/label/c.search_bar";
import searchApex from "@salesforce/apex/BookController.search";
import search from "@salesforce/apex/BookController.search";

export default class ModuleSubSearch extends LightningElement {
	searchValue = searchBarLabel;

	showSearchResult = false;
	loadingData = false;

	booksData;
	authorsData;

	noDataToDisplay = false;

	get books() {
		return this.booksData?.map((el) => ({
			bookId: el.Id,
			bookTitle: el.Title__c,
			bookAuthorName: el.Author__r.Name,
			bookHref: basePath + "/book-detail?Id=" + el.Id,
			redirect: () => {
				window.open(basePath + "/book-detail?Id=" + el.Id, "_self")
			}
		}));
	}

	get authors() {
		return this.authorsData?.map((el) => ({
			authorId: el.Id,
			authorName: el.Name
		}))
	}

	handleSearchInputKeyDown(event) {
		if (event.target.value.length >= 2) {
			this.showSearchResult = true;
			this.loadingData = true;
			searchApex({ textToSearch: event.target.value }).then((result) => {
				if (result[0].length > 0) {
					this.booksData = result[0];
					this.noDataToDisplay = false;
				}

				if (result[1].length > 0) {
					this.authorsData = result[1];
					this.noDataToDisplay = false;
				}

				if (result[0].length === 0 && result[1].length === 0) {
					this.noDataToDisplay = true;
				}
				console.log(this.booksData, "books data");
				console.log(this.authorsData, "author data")
				this.loadingData = false;
			});
		}

		console.log(this.showSearchResult, "asda");
	}

	hanldeSearchInputBlur(event) {
		this.showSearchResult = false;
	}

	handleSearchInputFocus(event) {
		if (event.target.value.length >= 2) {
			this.showSearchResult = true;
		}
	}
}
